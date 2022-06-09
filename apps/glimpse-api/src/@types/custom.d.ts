import {PrismaClient} from "@prisma/client";
import express, {Express} from "express";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import {Ability, RawRule} from "@casl/ability";

declare module 'express-session' {
    interface SessionData {
        permissionJSON?: RawRule[];
        userId?: number;
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        permissions?: Ability;
        // user?: User;
        prisma: PrismaClient;
    }
}

type ResolverContext = {
    prisma: PrismaClient;
    req: Express.Request;
    res: Express.Response;
}

/**
 * Type returned by startHttpServer()
 */
type CreateHttpServerResult = {
    expressServer: express.Express;
    httpServer: http.Server;
    apolloServer: ApolloServer;
};

/**
 * Types of values which can be set in the "trust proxy" express key/value.
 */
type TrustProxyOption = boolean | string | number | ((ip: string) => boolean);
