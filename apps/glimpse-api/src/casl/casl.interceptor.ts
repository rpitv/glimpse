import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
    NestInterceptor
} from "@nestjs/common";
import { firstValueFrom, Observable } from "rxjs";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import {
    AbilityAction,
    AbilitySubjects,
    CaslAbilityFactory,
    GlimpseAbility
} from "./casl-ability.factory";
import { Rule, RULES_METADATA_KEY } from "./rules.decorator";
import { Reflector } from "@nestjs/core";
import { subject } from "@casl/ability";
import { Request } from "express";

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    /**
     * Test the provided rules against the given ability.
     *
     * Rules are defined as either being an array containing a required AbilityAction plus an optional AbilitySubject
     * and field name, or a function which takes in a GlimpseAbility and optional value and then returns true or false.
     *
     * If an array-based rule is passed, pre-resolution, the rules are checked exactly as-is. Post-resolution, some
     * reasonable assumptions about the desired behavior are made:
     * - If the returned value is an object (or object array)...
     *   - The returned value is assumed to be of or an array of the subject type, if present.
     *   - The user must have permission to read all requested properties on the returned object(s).
     *   - If the user cannot read the object or any requested property on the object, a ForbiddenException is thrown.
     *     In the case of an array, the same must be true for every element of the array.
     * - If the returned value is a scalar (or scalar array)... TODO
     *   - The returned value is assumed to be a property of or an array of properties of the subject type, if present.
     *   -
     *
     * If these assumptions are not desirable, then you have two options:
     * - Disable post-resolution checks by setting the rule's "checkReturnedValue" property to "false". (TODO)
     * - Define the rule with a RuleFn, which lets you impose your own requirements.
     *
     * TODO these defaults are subject to change before the merging of the nestjs branch.
     *  Remove this to-do before merge.
     * @param rules Array of rules.
     * @param ability Glimpse ability to check each rule against.
     * @param value The value returned from the resolver. Pre-resolution, this is expected to be undefined.
     *  Post-resolution, this is expected to be anything else (null values are acceptable).
     * @private
     */
    private testRules(
        rules: Rule[],
        ability: GlimpseAbility,
        value?: any
    ): void {
        if (!rules || rules.length === 0) {
            this.logger.verbose(
                "No rules applied for the given resource. Calling method."
            );
        }

        // Go through each rule passed to @Rules() and run them.
        for (const rule of rules || []) {
            this.logger.verbose(
                `Testing ${rule.name ? `rule "${rule.name}"` : "unnamed rule"}${
                    value ? " with value" : ""
                }.`
            );
            // RuleFn
            if (typeof rule.rule === "function") {
                if (!rule.rule(ability, value)) {
                    this.logger.debug(
                        `${
                            rule.name ? `Rule "${rule.name}"` : "Unnamed rule"
                        } function returned false. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            }
            // [AbilityAction, AbilitySubjects, string]
            else {
                const castedRule = <[AbilityAction, AbilitySubjects, string]>(
                    rule.rule
                );

                // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
                //  to a string before testing.
                if (typeof castedRule[1] === "function") {
                    castedRule[1] = <Extract<AbilitySubjects, string>>(
                        (castedRule[1].modelName || castedRule[1].name)
                    );
                }

                // If subject is provided and the returned value is an array then make the permission checks on each
                //  element of the array. If this is undesirable, the developer can pass a RuleFn.
                if (value && Array.isArray(value) && castedRule[1]) {
                    for (let i = 0; i < value.length; i++) {
                        if (
                            !ability.can(
                                castedRule[0],
                                subject(
                                    <Extract<AbilitySubjects, string>>(
                                        castedRule[1]
                                    ),
                                    value[i]
                                ),
                                castedRule[2]
                            )
                        ) {
                            this.logger.debug(
                                `${
                                    rule.name
                                        ? `Rule "${rule.name}"`
                                        : "Unnamed rule"
                                } condition failed on array index ${i}. Throwing ForbiddenException.`
                            );
                            throw new ForbiddenException();
                        }
                    }
                } else if (!castedRule[1]) {
                    // No subject is passed. Just check the action.
                    if (!ability.can(castedRule[0], undefined)) {
                        this.logger.debug(
                            `${
                                rule.name
                                    ? `Rule "${rule.name}"`
                                    : "Unnamed rule"
                            } condition failed. Throwing ForbiddenException.`
                        );
                        throw new ForbiddenException();
                    }
                } else {
                    // Calculate subject value to pass to can(). If value is set, we pass that value after running it
                    //  through subject() with the subject passed to @Rules(). Otherwise, just pass the subject directly.
                    const subj = value
                        ? subject(
                              <Extract<AbilitySubjects, string>>castedRule[1],
                              value
                          )
                        : castedRule[1];
                    if (!ability.can(castedRule[0], subj, castedRule[2])) {
                        this.logger.debug(
                            `${
                                rule.name
                                    ? `Rule "${rule.name}"`
                                    : "Unnamed rule"
                            } condition failed. Throwing ForbiddenException.`
                        );
                        throw new ForbiddenException();
                    }
                    // TODO check user has permission to read each individual requested property on values
                }
            }
        }

        if (rules?.length > 0) {
            this.logger.verbose(
                `CASL interceptor passed all rule checks${
                    value
                        ? " with value. Interception complete."
                        : ". Calling method."
                }`
            );
        }
    }

    /**
     * Retrieve the Express Request object from the current execution context. Currently only supports GraphQL and
     *  HTTP execution contexts. If the execution context is set to something else, this will throw an Error.
     * @param context Execution context to retrieve the Request object from.
     * @throws Error if execution context type is not GraphQL or HTTP.
     */
    getRequest(context: ExecutionContext): Request {
        if (context.getType<GqlContextType>() === "graphql") {
            this.logger.verbose(
                "CASL interceptor currently in GraphQL context."
            );
            const gqlContext = GqlExecutionContext.create(context);
            return gqlContext.getContext().req;
        } else if (context.getType() === "http") {
            this.logger.verbose("CASL interceptor currently in HTTP context.");
            return context.switchToHttp().getRequest();
        } else {
            throw new Error(
                `CASL interceptor applied to unsupported context type ${context.getType()}`
            );
        }
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        const req = this.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug(
                "User request does not yet have CASL ability generated. Generating now..."
            );
            req.permissions = await this.caslAbilityFactory.createForUser(
                req.user
            );
        }
        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<Rule[]>(
            RULES_METADATA_KEY,
            context.getHandler()
        );

        this.testRules(rules, req.permissions);
        const value = await firstValueFrom(next.handle());
        this.logger.verbose("Method completed.");
        // Re-apply rules but with the actual return value passed in.
        // Note that conditional permission checks are limited to actual fields and not computed fields via
        //  @ResolveField(). There is no reasonable way to check these values for permissions.
        this.testRules(rules, req.permissions, value);
        return value;
    }
}
