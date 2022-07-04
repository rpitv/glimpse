import { Resolvers } from "../generated/graphql";
import {
    User,
    Person,
    UserPermission,
    UserGroup,
    AccessLog,
    AuditLog,
    ContactSubmissionAssignee,
    ProductionRSVP,
    VoteResponse,
    Asset,
} from ".prisma/client";
import { subject } from "@casl/ability";
import { canUpdate } from "../permissions";
import { GraphQLContext } from "custom";
import { GraphQLYogaError } from "@graphql-yoga/node";
import {
    constructPagination,
    assertValidPassword,
    getAccessibleByFilter,
} from "../utils";
import { hash, argon2id } from "argon2";

const PASSWORD_HASH_OPTIONS = {
    type: argon2id,
    memoryCost: 32768, // 32MiB
    timeCost: 4,
    parallelism: 1,
};

export const resolver: Resolvers = {
    Query: {
        findManyUser: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the User at the cursor. If not, return empty array, as if the User didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const user = await ctx.prisma.user.findUnique({
                    where: { id: pagination.cursor.id },
                });
                if (
                    !user ||
                    !ctx.permissions.can("read", subject("User", user), "id")
                ) {
                    return [];
                }
            }

            return await ctx.prisma.user.findMany({
                ...pagination,
                where: getAccessibleByFilter(ctx.permissions, "read").User,
            });
        },
        findOneUser: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User | null> => {
            // Get the User that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, "read").User,
                        { id: parseInt(args.id) },
                    ],
                },
            });
        },
    },
    Mutation: {
        createUser: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User> => {
            // Check that user is allowed to create the passed User. Fields aren't relevant in this context.
            if (!ctx.permissions.can("create", subject("User", args.input))) {
                throw new GraphQLYogaError("Insufficient permissions");
            }

            // If person is being updated to a new Person, check that the current user has permission to read the new
            //   Person, and then connect it. Only ID needs to be selected.
            let person = undefined;
            if (args.input.person) {
                person = await ctx.prisma.person.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, "read")
                                .Person,
                            { id: parseInt(args.input.person) },
                        ],
                    },
                    select: { id: true },
                });
                if (person === null) {
                    throw new GraphQLYogaError("Person does not exist");
                }
                // Wrap person object in a Prisma relation input.
                person = { connect: person };
            }

            // If password is being added, make sure it is valid, and then hash it using argon2id.
            let passwordHash = undefined;
            if (args.input.password) {
                try {
                    assertValidPassword(args.input.password);
                } catch (e) {
                    throw e;
                }
                passwordHash = await hash(
                    args.input.password,
                    PASSWORD_HASH_OPTIONS
                );
            }

            // Create the User.
            return await ctx.prisma.user.create({
                data: {
                    username: args.input.username,
                    mail: args.input.mail,
                    discord: args.input.discord,
                    person,
                    password: passwordHash,
                },
            });
        },
        updateUser: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User> => {
            // Get the requested User in its current state.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parseInt(args.id) },
            });
            // Check that this User exists and that the current user has permission to update it.
            if (
                user === null ||
                !canUpdate(ctx.permissions, "User", user, args.input)
            ) {
                throw new GraphQLYogaError("Insufficient permissions");
            }

            // If person is being updated to a new Person, check that the current user has permission to read the new
            //   Person, and then connect it. Otherwise, if person is being updated to null, disconnect the Person.
            //    Only ID needs to be selected.
            let person = undefined;
            if (args.input.person) {
                person = await ctx.prisma.person.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, "read")
                                .Person,
                            { id: parseInt(args.input.person) },
                        ],
                    },
                });
                if (person === null) {
                    throw new GraphQLYogaError("Person does not exist");
                }
                // Wrap person object in a Prisma relation input.
                person = { connect: person };
            } else if (args.input.person === null) {
                // Disconnect if null was provided.
                person = { disconnect: true };
            }

            // If password is being added, make sure it is valid, and then hash it using argon2id.
            let passwordHash = undefined;
            if (args.input.password) {
                try {
                    assertValidPassword(args.input.password);
                } catch (e) {
                    throw e;
                }
                passwordHash = await hash(
                    args.input.password,
                    PASSWORD_HASH_OPTIONS
                );
            }

            // Go through with updating the User.
            return await ctx.prisma.user.update({
                where: { id: parseInt(args.id) },
                data: {
                    username: args.input.username,
                    mail: args.input.mail,
                    discord: args.input.discord,
                    person,
                    password: passwordHash,
                },
            });
        },
        deleteUser: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User> => {
            // Get the User to delete, and check that the current user has permission to delete it.
            const user = await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, "delete").User,
                        { id: parseInt(args.id) },
                    ],
                },
            });
            // If null is returned, then either the User doesn't exist, or the current user doesn't have permission to
            //   delete it.
            if (user === null) {
                throw new GraphQLYogaError("Insufficient permissions");
            }
            // Go through with deleting the permission.
            return await ctx.prisma.user.delete({
                where: { id: parseInt(args.id) },
            });
        },
    },
    User: {
        person: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<Person | null> => {
            // Get the requested User, selecting only the Person.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { person: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the Person.
            return user.person;
        },
        permissions: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<UserPermission[]> => {
            // Get the requested User, selecting only the UserPermissions.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { permissions: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the Permissions array.
            return user.permissions;
        },
        groups: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<UserGroup[]> => {
            // Get the requested User, selecting only the Groups.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { groups: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the Groups array.
            return user.groups;
        },
        accessLogs: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<AccessLog[]> => {
            // Get the requested User, selecting only the AccessLogs.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { accessLogs: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the AccessLogs array.
            return user.accessLogs;
        },
        auditLogs: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<AuditLog[]> => {
            // Get the requested User, selecting only the AuditLogs.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { auditLogs: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the AuditLogs.
            return user.auditLogs;
        },
        assignedContactSubmissions: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<ContactSubmissionAssignee[]> => {
            // Get the requested User, selecting only the ContactSubmissionAssignees.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { assignedContactSubmissions: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the ContactSubmissionAssignees array.
            return user.assignedContactSubmissions;
        },
        productionRsvps: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<ProductionRSVP[]> => {
            // Get the requested User, selecting only the ProductionRSVPs.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { productionRsvps: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the ProductionRSVPs array.
            return user.productionRsvps;
        },
        voteResponses: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<VoteResponse[]> => {
            // Get the requested User, selecting only the VoteResponses.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { voteResponses: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the VoteResponses array.
            return user.voteResponses;
        },
        checkedOutAssets: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<Asset[]> => {
            // Get the requested User, selecting only the Assets.
            const user = await ctx.prisma.user.findUnique({
                where: { id: parent.id },
                select: { checkedOutAssets: true },
            });
            // This should never happen since the parent resolver would have returned null.
            if (user === null) {
                throw new GraphQLYogaError("User is unexpectedly null.");
            }
            // Return the Assets array.
            return user.checkedOutAssets;
        },
    },
};
