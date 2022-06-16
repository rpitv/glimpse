import {Resolvers} from "./generated/graphql";
import {User} from ".prisma/client";
import {subject} from "@casl/ability";
import {constructPagination} from "./permissions";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";

export const resolvers: Resolvers = {
    Query: {
        users: async (parent, args, ctx: GraphQLContext): Promise<User[]> => {
            // Construct pagination. If user is using cursor-based pagination, check that they
            //   have permission to read the element at the given cursor before returning. Without this,
            //   it's possible for users to determine whether a given record exists or not based on the response.
            const pagination = constructPagination(args);
            if(pagination.cursor) {
                const user = await ctx.prisma.user.findUnique({where: {id: pagination.cursor.id}})
                if(!user || !ctx.permissions.can('read', subject('User', user), 'id')) {
                    return []; // Return empty list, as if the element doesn't exist at all, if they can't read this.
                }
            }

            return await ctx.prisma.user.findMany({
                ...pagination,
                where: accessibleBy(ctx.permissions, 'read').User
            })

        }
    }
}
