import {Resolvers} from "../generated/graphql";
import {User, UserGroup, Group} from ".prisma/client";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";
import {subject} from "@casl/ability";
import {GraphQLYogaError} from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Query: {
        userGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup | null> => {
            // Get the UserGroup that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').UserGroup,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    Mutation: {
        createUserGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup> => {
            // Check that user is allowed to create the passed UserGroup. Fields aren't relevant in this context.
            if (!ctx.permissions.can('create', subject('UserGroup', args.input))) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // Check if the Group we're linking exists, and the current user has permission to read that Group.
            const group = await ctx.prisma.group.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').Group,
                        {id: parseInt(args.input.group)}
                    ]
                },
                select: {id: true}
            });
            if (group === null) {
                throw new GraphQLYogaError('Group does not exist');
            }

            // Check if the User we're linking exists, and the current user has permission to read that User.
            const user = await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').User,
                        {id: parseInt(args.input.user)}
                    ]
                },
                select: {id: true}
            });
            if (user === null) {
                throw new GraphQLYogaError('User does not exist');
            }

            // Create the UserGroup.
            return await ctx.prisma.userGroup.create({
                data: {
                    user: {
                        connect: user
                    },
                    group: {
                        connect: group
                    }
                }
            });
        },
        deleteUserGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup> => {
            // Get the UserGroup and assert that the current user has permission to delete it.
            const userGroup = await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'delete').UserGroup,
                        {id: parseInt(args.id)}
                    ]
                }
            });
            // If null is returned, then either the UserGroup doesn't exist, or they don't have permission to delete it.
            if (userGroup === null) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // Delete the UserGroup.
            return await ctx.prisma.userGroup.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    UserGroup: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            // Get the requested UserGroup, selecting only the connected User.
            const userGroup = await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').UserGroup,
                        {id: parent.id}
                    ]
                },
                select: {user: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (userGroup === null) {
                throw new GraphQLYogaError('UserGroup does not exist');
            }

            // Return the connected User.
            return userGroup.user;
        },
        group: async (parent, args, ctx: GraphQLContext): Promise<Group> => {
            // Get the requested UserGroup, selecting only the connected Group.
            const userGroup = await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').UserGroup,
                        {id: parent.id}
                    ]
                },
                select: {group: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (userGroup === null) {
                throw new GraphQLYogaError('UserGroup does not exist');
            }

            // Return the connected Group.
            return userGroup.group;
        }
    }
}
