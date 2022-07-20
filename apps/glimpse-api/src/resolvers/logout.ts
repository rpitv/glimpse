import { Resolvers } from "../generated/graphql";
import { GraphQLContext } from "custom";
import { logger } from "../logger";

export const resolver: Resolvers = {
    Mutation: {
        logout: (parent, args, ctx: GraphQLContext): Promise<boolean> => {
            return new Promise((resolve, reject) => {
                ctx.req.session.destroy((err) => {
                    if (err) {
                        logger.error(
                            { error: err },
                            `Error while logging out user ${ctx.user?.id}`
                        );
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        },
    },
};
