import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AbilityAction, AbilitySubjects, CaslAbilityFactory} from "./casl-ability.factory";
import {RULES_METADATA_KEY, Rule} from "./rules.decorator";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class RulesGuard implements CanActivate {
    private readonly logger: Logger = new Logger('RulesGuard');

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.verbose('Rules guard activated...')

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

        if(!req.permissions) {
            this.logger.debug('User request does not yet have CASL ability generated. Generating now...')
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }
        const rules = this.reflector.get<Rule[]>(RULES_METADATA_KEY, context.getHandler());

        if(!rules || rules.length === 0) {
            this.logger.verbose('No rules applied for the given resource. Can activate.');
            return true;
        }

        for(const rule of rules) {
            this.logger.verbose(`Testing ${rule.name ? `rule "${rule.name}"` : 'unnamed rule'}.`)
            // RuleFn
            if(typeof rule.rule === "function") {
                if(!rule.rule(req.permissions)) {
                    this.logger.verbose(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} function returned false. Cannot activate.`);
                    return false;
                }
            } else
            // [AbilityAction, AbilitySubjects, string]
             {
                 const castedRule = <[AbilityAction, AbilitySubjects, string]> rule.rule;

                 // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
                 //  to a string before testing.
                 if(typeof castedRule[1] === "function") {
                     castedRule[1] = <AbilitySubjects> (castedRule[1].modelName || castedRule[1].name);
                 }

                 if(!req.permissions.can(castedRule[0],castedRule[1], castedRule[2])) {
                     this.logger.verbose(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} condition failed. Cannot activate.`);
                     return false;
                 }
             }
        }

        this.logger.verbose(`Rules guard passed all rule checks. Can activate.`)
        return true;
    }
}
