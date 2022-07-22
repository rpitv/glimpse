import { Resolvers } from "../generated/graphql";
import { GraphQLContext } from "custom";
import { User } from "@prisma/client";
import { logger } from "../logger";
import { subject } from "@casl/ability";
import { GraphQLYogaError } from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Query: {
        self: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<User | null> => {
            // Get the user with the matching ID from the database.
            logger.debug(
                { userId: ctx.user?.id ?? null },
                "Requesting the identity of user in self resolver."
            );

            if (
                ctx.user &&
                !ctx.permissions.can("read", subject("User", ctx.user))
            ) {
                throw new GraphQLYogaError(
                    "Insufficient permissions to read self."
                );
            }

            return ctx.user ?? null;
        },
    },
};
