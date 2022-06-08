import dotenv from "dotenv";
dotenv.config();

import express, {Express} from "express";
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import session from "express-session";
import {createClient} from "redis"
import connectRedis from "connect-redis";
import https from "https";
import http from "http";
import * as ip from "ip";
import cors from "cors";
import fs from "fs-extra";
import path from "path";

import {prisma} from "./prisma";
import {injectRequestProperties} from "./middleware/injectRequestProperties";
import {resolvers} from './resolvers';
import {CreateHttpServerResult, ResolverContext, TrustProxyOption} from "./@types/custom";

/**
 * Check whether this server should run in HTTPS mode or not.
 * @returns true if HTTPS environment variable is set and isn't equal to "false", otherwise returns false.
 */
function isHttps(): boolean {
    return !!process.env.HTTPS && process.env.HTTPS !== "false";
}

async function loadSchema(): Promise<string> {
    const file = await fs.readFile(path.join(__dirname, "schema.graphql"))
    return file.toString();
}

/**
 * Create the HTTP/HTTPS server and Express app instances. This takes care of determining what type of server to use
 *   and creates the correct instances, but it doesn't start the server. The server should not be started until
 *   all middleware has been added to the Express app.
 * @param customTrustProxyValue Value to be set for the 'trust proxy' key in Express' key/value store. If you wish
 *   to not trust proxies, then this can be omitted.
 * @see http://expressjs.com/en/guide/behind-proxies.html
 */
async function createHttpServer(customTrustProxyValue?: TrustProxyOption): Promise<CreateHttpServerResult> {
    // --- Create Express server ---
    const expressServer = express();
    // When behind an HTTP proxy server, the PROXIED environment variable can be passed to enable express to trust it.
    //   http://expressjs.com/en/guide/behind-proxies.html
    if (customTrustProxyValue !== undefined) {
        expressServer.set('trust proxy', customTrustProxyValue);
    }

    // --- Create HTTP server ---
    let httpServer: http.Server;
    if (isHttps()) {
        // If user set the HTTPS env variable to true, but didn't set the KEY and/or CERT paths, server can't start.
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
            expressServer
        );
    } else {
        httpServer = http.createServer(expressServer);
    }

    // --- Create Apollo server ---
    const apolloServer = new ApolloServer({
        typeDefs: await loadSchema(),
        resolvers,
        context: ((ctx): ResolverContext => ({ prisma, ...ctx })),
        csrfPrevention: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    // "Start" Apollo server, and integrate with Express. Can't actually accept HTTP requests until HTTP server starts.
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: expressServer });

    return {
        expressServer,
        httpServer,
        apolloServer
    }
}

/**
 * Setup all the necessary middleware and listeners on an Express server.
 * @param expressServer Express server to add middleware to.
 */
async function setupMiddleware(expressServer: Express): Promise<void> {
    // Enable CORS in development environments, as frontend and backend may be running on separate ports/hosts
    if (process.env.NODE_ENV === "development") {
        expressServer.use(cors());
        console.log("App booted in development, enabling CORS");
    }

    // Create and add the middleware for sessions.
    const redisSessionStorageClient = createClient({
        legacyMode: true,
        url: process.env.REDIS_URL
    });
    redisSessionStorageClient.connect().catch(console.error);
    expressServer.use(session({
        store: new (connectRedis(session))({
            client: redisSessionStorageClient,
            prefix: 'glimpse-sess:'
        }),
        name: 'glimpse-sess',
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            secure: isHttps()
        },
        secret: process.env.SESSION_SECRET ?? '',
        saveUninitialized: false,
        resave: false,
    }));

    // Inject "user", "permissions", and "prisma" properties to the Request object.
    expressServer.use(injectRequestProperties);
    // Serve static content
    expressServer.use('/', express.static('public'));
}

/**
 * Start the API server. There is no guarantee that this will work if called more than once.
 */
async function main(): Promise<void> {
    // Enforce that some environment variables are set
    if(!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable not set. This is required.");
    }
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET environment variable not set. This is required.");
    }
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL environment variable not set. This is required.");
    }
    if(!process.env.NODE_ENV) {
        console.warn("NODE_ENV not set. Defaulting to production.")
        process.env.NODE_ENV = "production";
    }

    // If PROXIED environment variable is set and isn't equal to "false", then trust one layer of proxy.
    let trustProxyOption = (!!process.env.PROXIED && process.env.PROXIED !== "false") ? 1 : undefined;
    const {expressServer, httpServer} = await createHttpServer(trustProxyOption);
    await setupMiddleware(expressServer);

    const port = parseInt(process.env.PORT ?? "4000");
    const host = "0.0.0.0";

    httpServer.listen({port, host}, () => {
        const localIp = ip.address();
        const protocol = httpServer instanceof https.Server ? "https" : "http";
        console.log(
            "\n🎥 Glimpse GraphQL API is now running.\n" +
            `\tLocal: \t ${protocol}://localhost:${port}/\n` +
            `\tRemote:\t ${protocol}://${localIp}:${port}/\n`
        );

        if (process.env.NODE_ENV !== "development" && !isHttps()) {
            console.warn("Server is running without HTTPS outside of development. This is not recommended.");
        }
    });
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
