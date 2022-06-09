import {PrismaClient} from "@prisma/client";
import express from "express";
import http from "http";
import {ApolloServer} from "apollo-server-express";
import {Ability, RawRuleOf} from "@casl/ability";
import {User} from '.prisma/client'

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
type GlimpseAbility = [AbilityActions, AbilitySubjects];

/**
 * Type that the context passed to Apollo resolvers should follow
 */
type ResolverContext = {
    prisma: PrismaClient;
    req: Express.Request;
    res: Express.Response;
    permissions: Ability<GlimpseAbility>;
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
        permissionJSON?: RawRuleOf<Ability<GlimpseAbility>>[];
        userId?: number;
    }
}

