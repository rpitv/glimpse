import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { Logger } from "@nestjs/common";
import { Plugin } from "@nestjs/apollo";
import { CaslAbilityFactory } from "./casl-ability.factory";

/**
 * Apollo plugin that initializes the current user's permissions as of this request if they haven't been generated
 *  already. This is done with the help of {@link CaslAbilityFactory}.
 *
 *  This plugin is only for GraphQL requests. HTTP requests (and all other request types) are handled by the
 *  {@link CaslInterceptor}. A plugin exists specifically for GraphQL because I was experiencing issues with the NestJS
 *  interceptor not firing on GraphQL requests, and I am not sure why.
 *
 *  @see {@link CaslAbilityFactory} for how permissions are generated
 *  @see {@link CaslInterceptor} for HTTP counterpart
 */
@Plugin()
export class CaslPlugin implements ApolloServerPlugin {
    private readonly logger: Logger = new Logger("CaslPlugin");

    constructor(private caslAbilityFactory: CaslAbilityFactory) {}

    async requestDidStart(ctx) {
        const req = ctx.context.req;

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug("User request does not yet have CASL ability generated. Generating now...");
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }
    }
}
