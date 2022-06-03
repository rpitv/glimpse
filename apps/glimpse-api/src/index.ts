import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";

import express from "express";
import session from "express-session";
import https from "https";
import http from "http";
import * as ip from "ip";
import cors from "cors";
import fs from "fs-extra";
import { buildSchema } from "type-graphql";
import { graphqlHTTP } from "express-graphql";

import { prisma } from "./prisma";

type SetupResult = {
    port: number;
    protocol: "http" | "https";
    expressServer: express.Express;
};

/**
 * Create and set up the Express/Apollo server based off the program environment
 *   variables.
 */
async function start(): Promise<SetupResult> {
    const expApp = express();

    if (process.env.NODE_ENV === "development") {
        expApp.use(cors());
        console.log("App booted in development, enabling CORS");
    }

    expApp.use(
        "/graphql",
        graphqlHTTP({
            schema: await buildSchema({
                resolvers: [__dirname + "/resolvers/**/*.ts"],
                validate: false,
            }),
        })
    );

    const port = parseInt(process.env.PORT ?? "") || 4000;
    const host = "0.0.0.0";
    let httpServer: http.Server;
    let protocol: "https" | "http";
    if (process.env.HTTPS) {
        if (!process.env.HTTPS_KEY_PATH || !process.env.HTTPS_CERT_PATH) {
            throw new Error(
                "HTTPS is enabled but the key and/or cert path were not set."
            );
        }
        const privKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
        const cert = fs.readFileSync(process.env.HTTPS_CERT_PATH);

        httpServer = https.createServer(
            {
                key: privKey,
                cert: cert,
            },
            expApp
        );
        protocol = "https";
    } else {
        httpServer = http.createServer(expApp);
        protocol = "http";
    }

    return new Promise((resolve) => {
        httpServer.listen({ port, host }, () => {
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
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
