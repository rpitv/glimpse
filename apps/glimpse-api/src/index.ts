import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";

import express from "express";
import session from "express-session";
import {createClient} from "redis"
import connectRedis from "connect-redis";
import https from "https";
import http from "http";
import * as ip from "ip";
import cors from "cors";
import fs from "fs-extra";

import {prisma} from "./prisma";
import {getRouter} from "./router";
import {Ability} from "@casl/ability";
import {getPermissions} from "./auth";

type SetupResult = {
    port: number;
    protocol: "http" | "https";
    expressServer: express.Express;
};

const isHttps = !!process.env.HTTPS && process.env.HTTPS !== "false";
const isProxied = !!process.env.PROXIED && process.env.PROXIED !== "false";

/**
 * Create and set up the Express/Apollo server based off the program environment
 *   variables.
 */
async function start(): Promise<SetupResult> {
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET environment variable not set.");
    }
    if (!process.env.REDIS_URL) {
        throw new Error("SESSION_SECRET environment variable not set.");
    }

    const expApp = express();
    if (isProxied) {
        expApp.set('trust proxy', 1) // trust first proxy
    }

    // Session storage. Stored in Redis to separate from Postgres.
    const redisSessionStorageClient = createClient({
        legacyMode: true,
        url: process.env.REDIS_URL
    });
    redisSessionStorageClient.connect().catch(console.error);
    expApp.use(session({
        store: new (connectRedis(session))({
            client: redisSessionStorageClient,
            prefix: 'glimpse-sess:'
        }),
        name: 'glimpse-sess',
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            secure: isHttps
        },
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    }));

    expApp.use(async (req) => {
        if(req.session.userId) {
            req.user = await prisma.user.findUnique({
                where: {
                    id: req.session.userId
                }
            })
        }

        if(!req.session.permissionJSON) {
            req.session.permissionJSON = await getPermissions(req.user);
        }
        req.permissions = undefined; // new Ability(req.session.permissionJSON)
    })

    // Enable CORS in development environments, as frontend and backend may be running on separate ports/hosts
    if (process.env.NODE_ENV === "development") {
        expApp.use(cors());
        console.log("App booted in development, enabling CORS");
    }

    // Setup API endpoints (graphql, login, logout, etc).
    expApp.use('/api', await getRouter());
    // Serve static content
    expApp.use('/', express.static('public'));

    // Setup HTTP server
    const port = parseInt(process.env.PORT ?? "4000");
    const host = "0.0.0.0";
    let httpServer: http.Server;
    let protocol: "https" | "http";

    // Create HTTP/HTTPS server, depending on environment variables
    if (isHttps) {
        if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
            throw new Error(
                "HTTPS is enabled but the environment variable(s) HTTPS_KEY_PATH and/or HTTPS_CERT_PATH were not set."
            );
        }
        const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
        const cert = fs.readFileSync(process.env.HTTPS_CERT_PATH);

        httpServer = https.createServer(
            {
                key: privateKey,
                cert: cert,
            },
            expApp
        );
        protocol = "https";
    } else {
        httpServer = http.createServer(expApp);
        protocol = "http";
    }

    // Start listening for incoming connections
    return new Promise((resolve) => {
        httpServer.listen({port, host}, () => {
            resolve({
                port,
                protocol,
                expressServer: expApp,
            });
        });
    });
}

async function main(): Promise<void> {
    const setupResults = await start();
    const localIp = ip.address();
    console.log(
        "\n🎥 Glimpse GraphQL API is now running.\n" +
        `\tLocal: \t ${setupResults.protocol}://localhost:${setupResults.port}/\n` +
        `\tRemote:\t ${setupResults.protocol}://${localIp}:${setupResults.port}/\n`
    );

    if (process.env.NODE_ENV !== "development" && !isHttps) {
        console.warn("Server is running without HTTPS outside of development. This is not recommended.");
    }
}

if(!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable not set. This is required.");
}
if(!process.env.NODE_ENV) {
    console.warn("NODE_ENV not set. Defaulting to production.")
    process.env.NODE_ENV = "production";
}
main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
