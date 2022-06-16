import {Resolvers} from "../generated/graphql";
import {User, Person, UserPermission, UserGroup, AccessLog,
    AuditLog, ContactSubmissionAssignee, ProductionRSVP, VoteResponse, Asset} from ".prisma/client";
import {subject} from "@casl/ability";
import {constructPagination} from "../permissions";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";

export const resolver: Resolvers = {
    Query: {
        users: async (parent, args, ctx: GraphQLContext): Promise<User[]> => {
            // Construct pagination. If user is using cursor-based pagination, check that they
            //   have permission to read the element at the given cursor before returning. Without this,
            //   it's possible for users to determine whether a given record exists or not based on the response.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const user = await ctx.prisma.user.findUnique({where: {id: pagination.cursor.id}})
                if (!user || !ctx.permissions.can('read', subject('User', user), 'id')) {
                    return []; // Return empty list, as if the element doesn't exist at all, if they can't read this.
                }
            }

            return await ctx.prisma.user.findMany({
                ...pagination,
                where: accessibleBy(ctx.permissions, 'read').User
            })
        },
        user: async (parent, args, ctx: GraphQLContext): Promise<User | null> => {
            return await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    UserPermission: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            const userPermission = (await ctx.prisma.userPermission.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).UserPermission,
                        {id: parent.id}
                    ]
                },
                select: {
                    user: true
                }
            }));
            if (userPermission === null) {
                throw new Error('UserPermission is unexpectedly null.');
            }
            return userPermission.user;
        }
    },
    User: {
        person: async (parent, args, ctx: GraphQLContext): Promise<Person | null> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    person: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.person;
        },
        permissions: async (parent, args, ctx: GraphQLContext): Promise<UserPermission[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    permissions: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.permissions;
        },
        groups: async (parent, args, ctx: GraphQLContext): Promise<UserGroup[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    groups: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.groups;
        },
        accessLogs: async (parent, args, ctx: GraphQLContext): Promise<AccessLog[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    accessLogs: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.accessLogs;
        },
        auditLogs: async (parent, args, ctx: GraphQLContext): Promise<AuditLog[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    auditLogs: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.auditLogs;
        },
        assignedContactSubmissions: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmissionAssignee[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    assignedContactSubmissions: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.assignedContactSubmissions;
        },
        productionRsvps: async (parent, args, ctx: GraphQLContext): Promise<ProductionRSVP[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    productionRsvps: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.productionRsvps;
        },
        voteResponses: async (parent, args, ctx: GraphQLContext): Promise<VoteResponse[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    voteResponses: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.voteResponses;
        },
        checkedOutAssets: async (parent, args, ctx: GraphQLContext): Promise<Asset[]> => {
            const user = (await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).User,
                        {id: parent.id}
                    ]
                },
                select: {
                    checkedOutAssets: true
                }
            }));
            if (user === null) {
                throw new Error('User is unexpectedly null.');
            }
            return user.checkedOutAssets;
        }
    }
}
