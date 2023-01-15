import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {CaslAbilityFactory} from "./casl-ability.factory";
import {RULE_DECORATOR_KEY, RuleFn} from "./rule.decorator";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class RulesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers =
            this.reflector.get<RuleFn[]>(
                RULE_DECORATOR_KEY,
                context.getHandler(),
            ) || [];

        let req;
        if(context.getType<GqlContextType>() === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            req = gqlContext.getContext().req;
        } else if(context.getType() === 'http') {
            req = context.switchToHttp().getRequest();
        }

        const ability = await this.caslAbilityFactory.createForUser(req.user);
        return policyHandlers.every((handler) => handler(ability));
    }
}
