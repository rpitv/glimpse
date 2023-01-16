import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {firstValueFrom, Observable} from "rxjs";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";
import {CaslAbilityFactory} from "./casl-ability.factory";

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger('CaslInterceptor')

    constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        if(context.getType<GqlContextType>() !== 'graphql') {
            return next.handle();
        }

        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        if(!req.permissions) {
            this.logger.debug('User request does not yet have CASL ability generated. Generating now...')
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }
        const value = await firstValueFrom(next.handle());
        // TODO permission checks
        return value;
    }
}
