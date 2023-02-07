import { CallHandler, ExecutionContext, ForbiddenException, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { RuleDef, RuleFn, RULES_METADATA_KEY, RuleType } from "./rules.decorator";
import { Reflector } from "@nestjs/core";
import { CaslHelper } from "./casl.helper";

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    /**
     * Map of RuleType to the corresponding handler function.
     * @private
     */
    private readonly handlers: Map<RuleType, RuleFn> = new Map([
        [RuleType.ReadOne, this.caslHelper.handleReadOneRule],
        [RuleType.ReadMany, this.caslHelper.handleReadManyRule],
        [RuleType.Count, this.caslHelper.handleCountRule],
        [RuleType.Custom, this.caslHelper.handleCustomRule],
        [RuleType.Create, this.caslHelper.handleCreateRule],
        [RuleType.Update, this.caslHelper.handleUpdateRule],
        [RuleType.Delete, this.caslHelper.handleDeleteRule]
    ]);

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly caslHelper: CaslHelper
    ) {}

    /**
     * Format a Rule's name into a string that can be used to identify it in logs. If a name was not provided in the
     *  rule's config, it is inferred from the rule's type and subject. If a name was provided but is null or an empty
     *  string, "Unnamed rule" is returned. Otherwise, whatever value is provided in the config is used.
     * @param rule Rule to format the name of.
     * @returns Formatted name of the rule in the form "Rule "name"". If the rule is unnamed, then "Unnamed rule" is
     *  returned.
     * @private
     */
    private formatRuleName(rule: RuleDef): string {
        const setName = rule[2]?.name;
        // If a name wasn't provided in the rule config, the name can be inferred from the rule's type and subject.
        if(setName === undefined) {
            return `Rule "${rule[0]} ${rule[1]}"`
        }
        // If a name was explicitly set but is null or an empty string, use "Unnamed rule". Otherwise, return the name.
        return setName ? `Rule "${setName}"` : "Unnamed rule";
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        const req = this.caslHelper.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug("User request does not yet have CASL ability generated. Generating now...");
            req.permissions = await this.caslAbilityFactory.createForUser(req.user);
        }

        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<RuleDef[]>(RULES_METADATA_KEY, context.getHandler());

        let nextRuleFn = next.handle;

        if (!rules || rules.length === 0) {
            this.logger.verbose("No rules applied for the given resource. Pass.");
        } else
            // Rules are applied recursively, so we need to reverse the order of the rules so that the first rule in the
            //  list of rules is the first to be called. That rule then calls the next rule, and so on, until the actual
            //  resolver/handler is called.
            for (let i = rules.length - 1; i >= 0; i--) {
                const rule = rules[i];
                const ruleNameStr = this.formatRuleName(rule);

                // Cannot pass nextRuleFn directly as it'd pass by reference and cause infinite loop.
                const nextTemp = nextRuleFn;
                const handler = this.handlers.get(rule[0]);

                // This should only happen if this.handlers is not set up properly to define a handler for every
                //  RuleType.
                if (!handler) {
                    throw new Error(`Unsupported rule type ${rule[0]} on ${ruleNameStr}.`);
                }

                nextRuleFn = () => {
                    this.logger.verbose(`Initializing rule handler for ${ruleNameStr}`);

                    return handler(context, rule, nextTemp).pipe(
                        tap((value) => {
                            this.logger.verbose(`Rule handler for ${ruleNameStr} returned.`);

                            // If the rule failed, throw a ForbiddenException. We check for req.passed as this allows
                            //  the actual handler to set this value to true/false if it needs to. This is particularly
                            //  applicable to mutation handlers (create/update/delete), where you may want to check
                            //  permissions mid-database transaction.
                            if (!req.passed) {
                                this.logger.debug(
                                    `${ruleNameStr} failed (req.passed = ${req.passed}). Throwing ForbiddenException.`
                                );
                                throw new ForbiddenException();
                            }

                            // Reset req.passed context variable.
                            delete req.passed;
                            return value;
                        })
                    );
                };
            }

        return nextRuleFn();
    }
}
