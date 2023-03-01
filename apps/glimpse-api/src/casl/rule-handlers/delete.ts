/**
 * Handle a {@link Rule} definition with rule type {@link RuleType.Delete}. This function ensures that the user has
 *  permission to delete a resource of the given type, and intercepts the returned value from the resolver/handler
 *  that it is applied to, to make sure the user has permission to read that specific value. This is done by
 *  wrapping this method in the {@link this#readOneRuleHandler} method.
 *
 *  The current user's permissions are determined by the {@link Express.Request#permissions} property within the
 *  current NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this
 *  value.
 *
 *  If the user does not have permission to read or delete the resource, then this method sets
 *  {@link Express.Request#passed} to false on the context's request object and returns null, potentially before
 *  calling the handler. From there, the {@link CaslInterceptor} will see that {@link Request#passed} is false and
 *  throw an error. {@link Express.Request#passed} can also be set to false by the resolver/handler that this rule
 *  is applied to, which stops the rule checks and immediately returns back to the {@link CaslInterceptor}.
 *
 *  Options can be supplied to this function to change the behavior of the rule checks within the {@link RuleDef}
 *  argument.
 *
 * @todo Support toggling strict mode?
 *
 * @see {@link RuleOptions}
 * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
 *
 * @typeParam T - The type of the value expected to be returned by the resolver/handler which this rule is being
 *  applied to. Currently, this must be an instance of a valid {@link AbilitySubjects} type. This requirement may
 *  no longer be required.
 * @param context - NestJS execution context.
 * @param rule - Rule to test. If rule type is {@link RuleType.Custom}, an error will be thrown.
 * @param handler - The handler that calls the request method/resolver, or the next rule/interceptor in line if
 *  applicable. This is called after the necessary rule checks pass, and then additional checks are applied to the
 *  return value.
 * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
 *  mutate the return value from the next handler.
 * @throws Error if the rule type is {@link RuleType.Custom}.
 * @throws Error if the current user's permissions are not initialized.
 */
import { AbilityAction, AbilitySubjects } from "../casl-ability.factory";
import { ExecutionContext, Logger } from "@nestjs/common";
import { GraphQLResolverArgs } from "../../gql/graphql-resolver-args.class";
import { RuleDef } from "../rule.decorator";
import { map, Observable, of } from "rxjs";
import { subject } from "@casl/ability";
import { handleReadOneRule } from "./readOne";
import { CaslHelper } from "../casl.helper";

const logger = new Logger("DeleteRuleHandler");

export function handleDeleteRule<T extends Exclude<AbilitySubjects, string>>(
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<T | null>,
    caslHelper: CaslHelper
): Observable<T | null> {
    logger.debug("Handling Delete rule.");
    // Asserts that the rule is not a RuleType.Custom rule.
    const { req, subjectStr } = caslHelper.getReqAndSubject(context, rule);

    // Basic test with the provided action and subject.
    if (!req.permissions.can(AbilityAction.Delete, subjectStr)) {
        logger.verbose("Failed basic Delete rule test.");
        req.passed = false;
        return of(null);
    }

    // FIXME currently there is no way to check within the interceptor if the user has permission to delete the
    //  object to delete before it's been deleted. This check needs to be done in the resolver. This can be solved
    //  in a future refactor. Technically not required, but it could improve efficiency.

    return handler()
        .pipe(
            map((newValue) => {
                // Handler already marked the request as failed for some permission error.
                if (req.passed === false) {
                    logger.verbose("Failed Delete rule test. Handler already marked as failed.");
                    return null;
                }

                // Check the user can actually delete the object. Note, the deletion has already happened within the
                //  transaction at this point. However, if the user doesn't have permission, it'll be rolled back.
                //  The resolver can also do this before executing the deletion query. See the FIX-ME above.
                const subjectObj = subject(subjectStr, newValue);
                if (!req.permissions.can(AbilityAction.Delete, subjectObj)) {
                    logger.verbose("Failed Delete rule test with value.");
                    req.passed = false;
                    return null;
                }

                req.passed = true;
                return newValue;
            })
        )
        .pipe((v) => {
            // Make sure user has permission to read the fields they're trying to read after the deletion. Deletion will
            //  be rolled back if not.
            return handleReadOneRule(context, rule, () => v, caslHelper);
        });
}
