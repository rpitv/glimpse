import {Resolvers} from "./generated/graphql";
import {User} from ".prisma/client";
import {ResolverContext} from "./@types/custom";

export const resolvers: Resolvers = {
    Query: {
        users: async (parent, args, ctx: ResolverContext, info): Promise<User[]> => {
            return ctx.prisma.user.findMany({})
        }
    }
}
