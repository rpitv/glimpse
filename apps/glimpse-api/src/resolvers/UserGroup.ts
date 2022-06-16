import {Resolvers} from "../generated/graphql";
import {User, UserGroup, Group} from ".prisma/client";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";

export const resolver: Resolvers = {
    Query: {
        userGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup | null> => {
            return await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).UserGroup,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    Mutation: {
        createUserGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup> => {
            if(!args.userGroupInput.user || !args.userGroupInput.group) {
                throw new Error('Both user and group ID are required when creating user groups.');
            }
            return await ctx.prisma.userGroup.create({
                data: {
                    user: {
                        connect: {
                            id: parseInt(args.userGroupInput.user)
                        }
                    },
                    group: {
                        connect: {
                            id: parseInt(args.userGroupInput.group)
                        }
                    }
                }
            })
        },
        deleteUserGroup: async (parent, args, ctx: GraphQLContext): Promise<UserGroup> => {
            return await ctx.prisma.userGroup.delete({
                where: {
                    id: parseInt(args.id)
                }
            })
        }
    },
    UserGroup: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            const userGroup = (await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).UserGroup,
                        {id: parent.id}
                    ]
                },
                select: {
                    user: true
                }
            }));
            if (userGroup === null) {
                throw new Error('UserGroup is unexpectedly null.');
            }
            return userGroup.user;
        },
        group: async (parent, args, ctx: GraphQLContext): Promise<Group> => {
            const userGroup = (await ctx.prisma.userGroup.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).UserGroup,
                        {id: parent.id}
                    ]
                },
                select: {
                    group: true
                }
            }));
            if (userGroup === null) {
                throw new Error('UserGroup is unexpectedly null.');
            }
            return userGroup.group;
        },
    }
}
