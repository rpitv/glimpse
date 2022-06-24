import {Resolvers} from "../generated/graphql";
import {User, AuditLog} from "@prisma/client";
import {GraphQLContext} from "custom";
import {accessibleBy} from "@casl/prisma";
import {constructPagination} from "../utils";
import {subject} from "@casl/ability";

export const resolver: Resolvers = {
    Query: {
        auditLogs: async (parent, args, ctx: GraphQLContext): Promise<AuditLog[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the AuditLog at the cursor. If not, return empty array, as if the AuditLog didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const auditLog = await ctx.prisma.auditLog.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (auditLog === null || !ctx.permissions.can('read', subject("AuditLog", auditLog), "id")) {
                    return [];
                }
            }
            // Get the AuditLogs that the user has permission to read, and inject pagination object.
            return await ctx.prisma.auditLog.findMany({
                where: accessibleBy(ctx.permissions, 'read').AuditLog,
                ...pagination
            });
        },
        auditLog: async (parent, args, ctx: GraphQLContext): Promise<AuditLog | null> => {
            // Get the AuditLog that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.auditLog.findFirst({
                where: {
                    AND: [
                        accessibleBy(ctx.permissions, 'read').AuditLog,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    AuditLog: {
        user: async (parent, args, ctx: GraphQLContext): Promise<User | null> => {
            // Get the requested AuditLog, selecting only the user.
            const auditLog = await ctx.prisma.auditLog.findUnique({
                where: {id: parent.id},
                select: {user: true}
            });
            // If the AuditLog does not exist, return null. Should never happen since the parent resolver would have
            // returned null.
            if (auditLog === null) {
                return null;
            }
            // Return the connected User.
            return auditLog.user;
        }
    }
}
