import {CallHandler, ExecutionContext, ForbiddenException, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {firstValueFrom, Observable} from "rxjs";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";
import {AbilityAction, AbilitySubjects, CaslAbilityFactory, GlimpseAbility} from "./casl-ability.factory";
import {Rule, RULES_METADATA_KEY} from "./rules.decorator";
import {Reflector} from "@nestjs/core";
import {subject} from "@casl/ability";

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger('CaslInterceptor')

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    private testRules(rules: Rule[], ability: GlimpseAbility, value?: any) {

        if(!rules || rules.length === 0) {
            this.logger.verbose('No rules applied for the given resource. Calling method.');
        }

        // Go through each rule passed to @Rules() and run them.
        for(const rule of rules || []) {
            this.logger.verbose(`Testing ${rule.name ? `rule "${rule.name}"` : 'unnamed rule'}${value ? ' with value' : ''}.`)
            // RuleFn
            if(typeof rule.rule === "function") {
                if(!rule.rule(ability, value)) {
                    this.logger.debug(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} function returned false. Throwing ForbiddenException.`);
                    throw new ForbiddenException();
                }
            } else
                // [AbilityAction, AbilitySubjects, string]
            {
                const castedRule = <[AbilityAction, AbilitySubjects, string]> rule.rule;

                // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
                //  to a string before testing.
                if(typeof castedRule[1] === "function") {
                    castedRule[1] = <Extract<AbilitySubjects, string>> (castedRule[1].modelName || castedRule[1].name);
                }

                // If subject is provided and the returned value is an array then make the permission checks on each
                //  element of the array. If this is undesirable, the developer can pass a RuleFn.
                if(value && Array.isArray(value) && castedRule[1]) {
                    for(let i = 0; i < value.length; i++) {
                        if(!ability.can(castedRule[0], subject(<Extract<AbilitySubjects, string>> castedRule[1], value[i]), castedRule[2])) {
                            this.logger.debug(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} condition failed on array index ${i}. Throwing ForbiddenException.`);
                            throw new ForbiddenException();
                        }
                    }
                } else if(!castedRule[1]) { // No subject is passed. Just check the action.
                    if(!ability.can(castedRule[0], undefined)) {
                        this.logger.debug(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} condition failed. Throwing ForbiddenException.`);
                        throw new ForbiddenException();
                    }
                } else {
                    // Calculate subject value to pass to can(). If value is set, we pass that value after running it
                    //  through subject() with the subject passed to @Rules(). Otherwise, just pass the subject directly.
                    const subj = value ? subject(<Extract<AbilitySubjects, string>> castedRule[1], value) : castedRule[1];
                    if(!ability.can(castedRule[0], subj, castedRule[2])) {
                        this.logger.debug(`${rule.name ? `Rule "${rule.name}"` : 'Unnamed rule'} condition failed. Throwing ForbiddenException.`);
                        throw new ForbiddenException();
                    }
                    // TODO check user has permission to read each individual requested property on values
                }

            }
        }

        if(rules?.length > 0) {
            this.logger.verbose(`CASL interceptor passed all rule checks${value ? ' with value. Interception complete.' : '. Calling method.'}`)
        }
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.logger.verbose('CASL interceptor activated...')

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        let req;
        if(context.getType<GqlContextType>() === 'graphql') {
            this.logger.verbose('CASL interceptor currently in GraphQL context.');
            const gqlContext = GqlExecutionContext.create(context);
            req = gqlContext.getContext().req;
        } else if(context.getType() === 'http') {
            this.logger.verbose('CASL interceptor currently in HTTP context.');
            req = context.switchToHttp().getRequest();
        } else {
            throw new Error(`CASL interceptor applied to unsupported context type ${context.getType()}`)
        }

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if(!req.permissions) {
            this.logger.debug('User request does not yet have CASL ability generated. Generating now...')
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }
        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<Rule[]>(RULES_METADATA_KEY, context.getHandler());

        this.testRules(rules, req.permissions);
        const value = await firstValueFrom(next.handle());
        this.logger.verbose('Method completed.')
        // Re-apply rules but with the actual return value passed in.
        // Note that conditional permission checks are limited to actual fields and not computed fields via
        //  @ResolveField(). There is no reasonable way to check these values for permissions.
        this.testRules(rules, req.permissions, value);
        return value;
    }
}
