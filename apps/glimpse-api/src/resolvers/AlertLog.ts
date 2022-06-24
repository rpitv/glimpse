import {Resolvers} from "../generated/graphql";
import {AlertLog} from ".prisma/client";
import {accessibleBy} from "@casl/prisma";
import {GraphQLContext} from "custom";
import {constructPagination} from "../utils";
import {subject} from "@casl/ability";
import {GraphQLYogaError} from "@graphql-yoga/node";

export const resolver: Resolvers ={
    Query: {
        alertLogs: async (parent, args, ctx: GraphQLContext): Promise<AlertLog[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the AlertLog at the cursor. If not, return empty array, as if the AlertLog didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const alertLog = await ctx.prisma.alertLog.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (alertLog === null || !ctx.permissions.can('read', subject("AlertLog", alertLog), "id")) {
                    return [];
                }
            }

            // Get the AlertLogs that the user has permission to read, and inject pagination object.
            return await ctx.prisma.alertLog.findMany({
                where: accessibleBy(ctx.permissions, 'read').AlertLog,
                ...pagination
            });
        },
        alertLog: async (parent, args, ctx: GraphQLContext): Promise<AlertLog | null> => {
            // Get the AlertLog that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.alertLog.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').AlertLog,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    Mutation: {
        createAlertLog: async (parent, args, ctx: GraphQLContext): Promise<AlertLog> => {
            // Check that user is allowed to create the passed AlertLog. Fields aren't relevant in this context.
            if (!ctx.permissions.can('create', subject('AlertLog', args.input))) {
                throw new GraphQLYogaError('Insufficient permissions');
            }
            // Create the AlertLog.
            return await ctx.prisma.alertLog.create({
                data: {
                    message: args.input.message,
                    severity: args.input.severity
                }
            });
        }
    }
}
