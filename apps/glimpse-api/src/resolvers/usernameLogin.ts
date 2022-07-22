import { Resolvers } from "../generated/graphql";
import { GlimpseAbility, GraphQLContext } from "custom";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { verify } from "argon2";
import { PASSWORD_HASH_OPTIONS } from "../utils";
import { logger } from "../logger";
import { getPermissions } from "../permissions";
import { RawRuleOf } from "@casl/ability";
import { PrismaAbility } from "@casl/prisma";

export const resolver: Resolvers = {
    Mutation: {
        usernameLogin: async (
            parent,
            args,
            ctx: GraphQLContext
        ): Promise<boolean> => {
            logger.debug(`Attempting to log in with username ${args.username}`);
            // Users must log out before logging into another account.
            if (ctx.user !== undefined) {
                logger.debug(
                    `User ${ctx.user.id} attempted to log in while they're already logged in.`
                );
                throw new GraphQLYogaError("You are already logged in");
            }

            // Get the user with the matching username from the database.
            const user = await ctx.prisma.user.findUnique({
                where: { username: args.username },
            });
            if (!user || !user.password) {
                throw new GraphQLYogaError("Incorrect password or username");
            }
            // Check that the password is correct and catch any errors.
            let isValid = false;
            try {
                isValid = await verify(
                    user.password,
                    args.password,
                    PASSWORD_HASH_OPTIONS
                );
            } catch (err) {
                logger.error(
                    { error: err },
                    `Error while verifying password for user with username ${args.username}`
                );
                throw err;
            }

            if (!isValid) {
                throw new GraphQLYogaError("Incorrect password or username");
            }

            // Log the user in by updating their session.
            ctx.user = user;
            ctx.req.session.userId = user.id;
            // Cast is required since string is not covariant with AbilityActions, but DB doesn't have
            //   AbilityActions enum.
            ctx.req.session.permissionJSON = <RawRuleOf<GlimpseAbility>[]>(
                await getPermissions(user)
            );
            ctx.permissions = new PrismaAbility(ctx.req.session.permissionJSON);

            logger.debug(`User ${user.id} logged in.`);
            return true;
        },
    },
};
