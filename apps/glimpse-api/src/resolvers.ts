import {Resolvers} from "./generated/graphql";
import {User} from ".prisma/client";
import {ResolverContext} from "custom";

export const resolvers: Resolvers = {
    Query: {
        users: async (parent, args, ctx: ResolverContext): Promise<User[]> => {
            if(ctx.permissions.cannot('read', 'User')) {
                throw new Error("Insufficient permissions");
            }
            return ctx.prisma.user.findMany({})
        }
    }
}
