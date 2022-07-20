import { Resolvers } from "../generated/graphql";
import { UserPermission, GroupPermission } from "@prisma/client";
import { logger } from "../logger";

export const resolver: Resolvers = {
    Permission: {
        __resolveType: (permission: UserPermission | GroupPermission) => {
            logger.debug(
                permission,
                "Resolving what type of Permission the permission is (UserPermission or GroupPermission)"
            );
            if ((<UserPermission>permission).userId !== undefined) {
                return "UserPermission";
            } else if ((<GroupPermission>permission).groupId !== undefined) {
                return "GroupPermission";
            } else {
                throw new Error("Unknown Permission type");
            }
        },
    },
};
