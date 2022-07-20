import { PrismaClient } from "@prisma/client";
import { RawRuleOf } from "@casl/ability";
import { User } from ".prisma/client";
import { PrismaAbility } from "@casl/prisma";
import {
    MutationResolvers,
    PermissionResolvers,
    QueryResolvers,
    Resolvers,
} from "../generated/graphql";
import { GraphQLScalarType } from "graphql";

/**
 * Types of acceptable actions for CASL permissions
 */
type AbilityActions = "create" | "read" | "update" | "delete" | "manage";
/**
 * Types of acceptable subjects for CASL permissions
 */
type AbilitySubjects = User | typeof User | "User" | "all";
/**
 * Tuple of CASL ability actions & subjects
 */
type GlimpseAbility = PrismaAbility<[AbilityActions, AbilitySubjects]>;

type CrudGeneratorOptions<Type extends string | number | symbol = string> = {
    findMany?: boolean;
    findOne?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    transformers?: {
        write?: {
            [K in string]?: (obj: any, ctx: GraphQLContext) => any;
        };
        read?: {
            [K in Type]?: (obj: any, ctx: GraphQLContext) => any;
        };
    };
    relations?: Type[];
};

type OmitChildType<Type, OmittedChild> = {
    [P in keyof Type as NonNullable<Type[P]> extends OmittedChild
        ? never
        : P]: Type[P];
};

type ValidCrudResolvers = keyof OmitChildType<
    Resolvers<GraphQLContext>,
    GraphQLScalarType | MutationResolvers | QueryResolvers | PermissionResolvers
>;

type PrismaDelegateName =
    | "accessLog"
    | "alertLog"
    | "asset"
    | "auditLog"
    | "blogPost"
    | "category"
    | "contactSubmissionAssignee"
    | "contactSubmission"
    | "credit"
    | "groupPermission"
    | "group"
    | "image"
    | "person"
    | "personImage"
    | "productionImage"
    | "productionRSVP"
    | "productionTag"
    | "productionVideo"
    | "production"
    | "redirect"
    | "role"
    | "userGroup"
    | "userPermission"
    | "user"
    | "video"
    | "voteResponse"
    | "vote";

/**
 * Context passed to GraphQL incoming requests.
 */
type GraphQLContext = {
    prisma: PrismaClient;
    permissions: GlimpseAbility;
    user?: User;
    req: Express.Request;
};

/**
 * Types of values which can be set in the "trust proxy" express key/value.
 */
type TrustProxyOption = boolean | string | number | ((ip: string) => boolean);

declare module "express-session" {
    interface SessionData {
        permissionJSON?: RawRuleOf<GlimpseAbility>[];
        userId?: number;
    }
}
