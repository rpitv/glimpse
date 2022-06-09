import {PrismaClient} from "@prisma/client";
import express from "express";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import {RawRuleOf} from "@casl/ability";
import {User} from '.prisma/client'
import {PrismaAbility} from "@casl/prisma";

/**
 * Types of acceptable actions for CASL permissions
 */
type AbilityActions = 'create' | 'read' | 'update' | 'delete' | 'manage';
/**
 * Types of acceptable subjects for CASL permissions
 */
type AbilitySubjects = User | typeof User | 'User' | 'all';
/**
 * Tuple of CASL ability actions & subjects
 */
type GlimpseAbility = PrismaAbility<[AbilityActions, AbilitySubjects]>;

/**
 * Type that the context passed to Apollo resolvers should follow
 */
type ResolverContext = {
    prisma: PrismaClient;
    req: Express.Request;
    res: Express.Response;
    permissions: GlimpseAbility;
    user?: User;
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

declare module 'express-session' {
    interface SessionData {
        permissionJSON?: RawRuleOf<GlimpseAbility>[];
        userId?: number;
    }
}

