import {Resolvers} from "../generated/graphql";
import {AccessLog, User} from ".prisma/client";
import {GraphQLContext} from "custom";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {constructPagination} from "../utils";
import {subject} from "@casl/ability";
import {accessibleBy} from "@casl/prisma";

export const resolvers: Resolvers = {
    Query: {
        accessLogs: async (parent, args, ctx: GraphQLContext): Promise<AccessLog[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the AccessLog at the cursor. If not, return empty array, as if the AccessLog didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const accessLog = await ctx.prisma.accessLog.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (accessLog === null || !ctx.permissions.can('read', subject("AccessLog", accessLog), "id")) {
                    return [];
                }
            }

            // Get the AccessLogs that the user has permission to read, and inject pagination object.
            return await ctx.prisma.accessLog.findMany({
                where: accessibleBy(ctx.permissions).AccessLog,
                ...pagination
            });
        },
        accessLog: async (parent, args, ctx: GraphQLContext): Promise<AccessLog | null> => {
            // Get the AccessLog that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.accessLog.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions).AccessLog,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    AccessLog: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            // Get the requested AccessLog, selecting only the User.
            const accessLog = await ctx.prisma.accessLog.findUnique({
                where: {id: parent.id},
                select: {user: true}
            });
            // If the AccessLog does not exist, return null. Should never happen since the parent resolver would have
            //   returned null.
            if (accessLog === null) {
                throw new GraphQLYogaError('AccessLog is unexpectedly null.');
            }
            // Return the connected User.
            return accessLog.user;
        }
    }
}
