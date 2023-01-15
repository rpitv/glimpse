import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {CaslAbilityFactory} from "./casl-ability.factory";
import {RULE_DECORATOR_KEY, RuleFn} from "./rule.decorator";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class RulesGuard implements CanActivate {
    private readonly logger: Logger = new Logger('RulesGuard');

    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.verbose('Rules guard activated...')
        const ruleFns =
            this.reflector.get<RuleFn[]>(
                RULE_DECORATOR_KEY,
                context.getHandler(),
            ) || [];

        if(ruleFns.length === 0) {
            this.logger.verbose('No rules applied for the given resource. Can activate.');
            return true;
        }

        let req;
        if(context.getType<GqlContextType>() === 'graphql') {
            this.logger.verbose('Rules guard currently in GraphQL context.');
            const gqlContext = GqlExecutionContext.create(context);
            req = gqlContext.getContext().req;
        } else if(context.getType() === 'http') {
            this.logger.verbose('Rules guard currently in HTTP context.');
            req = context.switchToHttp().getRequest();
        } else {
            throw new Error(`RulesGuard applied to unsupported context type ${context.getType()}`)
        }

        const ability = await this.caslAbilityFactory.createForUser(req.user);
        const canActivate = ruleFns.every((handler) => {
            this.logger.verbose(`Testing rule ${handler}`)
            const result = handler(ability)
            this.logger.debug(`Rule ${handler} returned: ${result}`)
            return result;
        });

        if(canActivate) {
            this.logger.verbose(`Rules guard passed all rule checks. Can activate.`)
        } else {
            this.logger.verbose(`Rules guard failed at least one rule check. Cannot activate.`);
        }
        return canActivate;
    }
}
