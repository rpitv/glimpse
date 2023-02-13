import {ApolloServerPlugin} from "apollo-server-plugin-base";
import {Logger} from "@nestjs/common";
import {Plugin} from "@nestjs/apollo";
import {CaslAbilityFactory} from "./casl-ability.factory";

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
