import {Resolvers} from "./generated/graphql";
import {User} from ".prisma/client";
import {ResolverContext} from "custom";
import {subject} from "@casl/ability";

export const resolvers: Resolvers = {
    Query: {
        users: async (parent, args, ctx: ResolverContext): Promise<User[]> => {
            return (await ctx.prisma.user.findMany({})).filter((user) => {
                return ctx.permissions.can('read', subject('User', user))
            })
        }
    }
}
