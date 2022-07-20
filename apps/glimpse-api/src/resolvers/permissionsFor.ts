import { Resolvers } from "../generated/graphql";
import { GraphQLContext } from "custom";
import { GroupPermission, UserPermission } from "@prisma/client";
import { logger } from "../logger";
import { getPermissions } from "../permissions";

export const resolver: Resolvers = {
    Query: {
        permissionsFor: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<(UserPermission | GroupPermission)[]> => {
            // Get the user with the matching ID from the database.
            logger.debug(
                { userId: args.user },
                "Requesting the user in permissionsFor resolver"
            );

            let user;
            if (args.user !== undefined && args.user !== null) {
                user = await ctx.prisma.user.findUnique({
                    where: { id: parseInt(args.user) },
                });
                if (!user) {
                    logger.debug("User not found in permissionsFor resolver");
                    throw new Error("User not found");
                }
            } else {
                user = undefined;
            }

            // Return the user's permissions
            return await getPermissions(user);
        },
    },
};
