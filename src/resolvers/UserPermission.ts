import {Resolvers} from "../generated/graphql";
import {User, UserPermission} from ".prisma/client";
import {GraphQLContext} from "custom";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {subject} from "@casl/ability";
import {canUpdate} from "../permissions";
import {getAccessibleByFilter} from "../utils";

export const resolver: Resolvers = {
    Query: {
        userPermission: async (parent, args, ctx: GraphQLContext): Promise<UserPermission | null> => {
            // Get the UserPermission that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.userPermission.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'read').UserPermission,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    Mutation: {
        createUserPermission: async (parent, args, ctx: GraphQLContext): Promise<UserPermission> => {
            // Check that user is allowed to create the passed UserPermission. Fields aren't relevant in this context.
            if(!ctx.permissions.can('create', subject('UserPermission', args.input))) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // Check if the User we're linking exists, and the current user has permission to read that User.
            const user = await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'read').User,
                        {id: parseInt(args.input.user)}
                    ]
                },
                select: {
                    id: true
                }
            });
            if(user === null) {
                throw new GraphQLYogaError('User does not exist');
            }

            // Create the UserPermission.
            return await ctx.prisma.userPermission.create({
                data: {
                    user: {
                        connect: user
                    },
                    action: args.input.action,
                    subject: args.input.subject,
                    fields: args.input.fields,
                    conditions: args.input.conditions,
                    inverted: args.input.inverted ?? false,
                    reason: args.input.reason
                }
            })
        },
        updateUserPermission: async (parent, args, ctx: GraphQLContext): Promise<UserPermission> => {
            // Get the requested UserPermission in its current state.
            const permission = await ctx.prisma.userPermission.findUnique({
                where: {id: parseInt(args.id)}
            })
            // Check that this UserPermission exists, and the current user has permission to update it.
            if(permission === null || !canUpdate(ctx.permissions, 'UserPermission', permission, args.input)) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // Go through with updating the UserPermission.
            return await ctx.prisma.userPermission.update({
                where: {id: parseInt(args.id)},
                data: args.input
            });
        },
        deleteUserPermission: async (parent, args, ctx: GraphQLContext): Promise<UserPermission> => {
            // Get the UserPermission to delete, and check that the current user has permission to delete it.
            const permission = await ctx.prisma.userPermission.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'delete').UserPermission,
                        {id: parseInt(args.id)}
                    ]
                }
            });
            // If null is returned, then either the UserPermission doesn't exist, or they don't have permission to delete it.
            if(permission === null) {
                throw new GraphQLYogaError('Insufficient permissions');
            }
            // Go through with deleting the permission.
            return await ctx.prisma.userPermission.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    UserPermission: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            // Get the requested UserPermission, selecting only the connected User.
            const userPermission = (await ctx.prisma.userPermission.findUnique({
                where: {id: parent.id},
                select: {user: true}
            }));
            // This should never happen since the parent resolver would have returned null.
            if (userPermission === null) {
                throw new Error('UserPermission is unexpectedly null.');
            }
            // Return the connected user
            return userPermission.user;
        }
    }
}
