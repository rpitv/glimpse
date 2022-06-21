import {Resolvers} from "../generated/graphql";
import {User, UserPermission} from ".prisma/client";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";

export const resolver: Resolvers = {
    Query: {
        userPermission: async (parent, args, ctx: GraphQLContext): Promise<UserPermission | null> => {
            return await ctx.prisma.userPermission.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).UserPermission,
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
    }
}
