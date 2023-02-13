import { CallHandler, ExecutionContext, ForbiddenException, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { CaslAbilityFactory } from "./casl-ability.factory";
import { RuleDef, RULES_METADATA_KEY } from "./rule.decorator";
import { Reflector } from "@nestjs/core";
import { CaslHelper } from "./casl.helper";

/**
 * Interceptor that retrieves the @Rule() decorators from controller handlers and resolvers, and makes sure that the
 *  currently logged-in user has permission to perform the attached action. If the user does not have permission, then
 *  a ForbiddenException is thrown. If the user does have permission, then the request continues on as normal. In some
 *  situations, the request's response may be altered by the interceptor to remove fields that the user is not allowed
 *  to see.
 *
 *  The @Rule() decorator should only be used for HTTP contexts. For GraphQL contexts, use the @rule GraphQL directive.
 *
 *  This interceptor also initializes {@link Request#permissions} if it's not already initialized. For some reason,
 *  this seems to not always work for GraphQL requests, so {@link CaslPlugin} does the same thing for GraphQL requests.
 *
 *  @see {@link RuleDirective} and {@link CaslPlugin} for GraphQL counterparts
 *  @see {@link Rule} for @Rule() decorator
 *  @see {@link CaslHelper} for implementations of rule checks
 *  @see {@link CaslAbilityFactory} for how permissions are generated
 *  @see {@link https://github.com/nestjs/graphql/issues/631}
 */
@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
        private readonly caslHelper: CaslHelper
    ) {}

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

        let nextRuleFn = () =>
            next.handle().pipe(
                tap((value) => {
                    this.logger.verbose(`Base resolver returned.`);
                    // If the rule failed, throw a ForbiddenException. We check for req.passed as this allows
                    //  the actual handler to set this value to true/false if it needs to. This is particularly
                    //  applicable to mutation handlers (create/update/delete), where you may want to check
                    //  permissions mid-database transaction. Unlike rules, req.passed defaults to true for
                    //  handlers.
                    if (req.passed === false) {
                        this.logger.debug(
                            `Base resolver failed (req.passed = ${req.passed}). Throwing ForbiddenException.`
                        );
                        // Reset req.passed context variable.
                        delete req.passed;
                        throw new ForbiddenException();
                    }
                    // Reset req.passed context variable.
                    delete req.passed;
                    return value;
                })
            );

        if (!rules || rules.length === 0) {
            this.logger.verbose("No rules applied for the given resource. Checking only for req.passed.");
        }
        // Rules are applied recursively, so we need to reverse the order of the rules so that the first rule in the
        //  list of rules is the first to be called. That rule then calls the next rule, and so on, until the actual
        //  resolver/handler is called.
        else
            for (let i = rules.length - 1; i >= 0; i--) {
                const rule = rules[i];
                const ruleNameStr = this.caslHelper.formatRuleName(rule);

                // Cannot pass nextRuleFn directly as it'd pass by reference and cause infinite loop.
                const nextTemp = nextRuleFn;
                const handler = this.caslHelper.handlers.get(rule[0]);

                // This should only happen if handlers is not set up properly to define a handler for every
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
                                // Reset req.passed context variable.
                                delete req.passed;
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
