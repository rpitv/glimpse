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
            if (
                args.user !== undefined &&
                args.user !== null &&
                !isNaN(parseInt(args.user))
            ) {
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

            // Return the user's permissions. In this case, being able to check your own permissions is an implicitly
            //   guaranteed permission. Therefore, we don't need to check that the user is able to read each permission,
            //   since all users can read all of their own permissions. However, note that this caveat only applies
            //   to the scalar fields in permissions. Checking the name of the group your permissions belong to, for
            //   example, is not a guaranteed right.
            return await getPermissions(user);
        },
    },
};
