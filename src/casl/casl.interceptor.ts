import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { CaslHelper } from "./casl.helper";

/**
 * Interceptor that defines the user's {@link GlimpseAbility} on {@link Express.Request#permissions} if it's not already
 *  defined. This is done with the help of {@link CaslAbilityFactory}.
 */
@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    constructor(private readonly caslAbilityFactory: CaslAbilityFactory, private readonly caslHelper: CaslHelper) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        const req = this.caslHelper.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug("User request does not yet have CASL ability generated. Generating now...");
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }

        return next.handle();
    }
}
