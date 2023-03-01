/**
 * Handle a {@link Rule} definition with rule type {@link RuleType.ReadOne}. This function ensures that the user has
 *  permission to read a single resource of the given type, and intercepts the returned value from the
 *  resolver/handler that it is applied to, to make sure the user has permission to read that specific value.
 *
 *  The current user's permissions are determined by the {@link Express.Request#permissions} property within the
 *  current NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this
 *  value.
 *
 *  If the user does not have permission to read the resource, then this method sets {@link Express.Request#passed}
 *  to false on the context's request object and returns null, potentially before calling the handler. From there,
 *  the {@link CaslInterceptor} will see that {@link Request#passed} is false and throw an error.
 *  {@link Express.Request#passed} can also be set to false by the resolver/handler that this rule is applied to,
 *  which stops the rule checks and immediately returns back to the {@link CaslInterceptor}.
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
import { GqlContextType } from "@nestjs/graphql";
import { subject } from "@casl/ability";
import { CaslHelper } from "../casl.helper";

const logger = new Logger("ReadOneRuleHandler");

export function handleReadOneRule<T extends Exclude<AbilitySubjects, string>>(
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<T | null>,
    caslHelper: CaslHelper
): Observable<T | null> {
    logger.debug("Handling ReadOne rule.");
    // Asserts that the rule is not a RuleType.Custom rule.
    const { req, subjectStr } = caslHelper.getReqAndSubject(context, rule);

    // Basic test with the provided action and subject.
    if (!rule.options?.defer && !req.permissions.can(AbilityAction.Read, subjectStr)) {
        logger.verbose("Failed basic ReadOne rule test.");
        req.passed = false;
        return of(null);
    }

    const fields: Set<string> = new Set();
    // Field-based tests can only be done pre-resolver for GraphQL requests, since the request includes the
    //  fields to be returned. Non-GraphQL requests don't include this, as all fields are returned.
    if (context instanceof GraphQLResolverArgs || context.getType<GqlContextType>() === "graphql") {
        // getSelectedFields includes type, but we only want the field name.
        caslHelper.getSelectedFields(context).forEach((v) => fields.add(v.split(".", 2)[1]));

        // Remove any specifically excluded fields from the list of fields.
        if (rule.options?.excludeFields) {
            rule.options.excludeFields.forEach((v) => fields.delete(v));
        }

        // Test the ability against each requested field
        for (const field of fields) {
            if (!rule.options?.defer && !req.permissions.can(AbilityAction.Read, subjectStr, field)) {
                logger.verbose(`Failed field-based ReadOne rule test for field "${field}".`);
                req.passed = false;
                return of(null);
            }
        }
    }

    // Call next rule, or resolver/handler if no more rules.
    return handler().pipe(
        map((value) => {
            // Handler already marked the request as failed for some permission error.
            if (req.passed === false) {
                logger.verbose("Failed ReadOne rule test. Handler already marked as failed.");
                return null;
            }

            // If the value is nullish, there's no value to check, so just return null.
            if (value === null || value === undefined) {
                req.passed = true;
                return null;
            }

            // Repeat previous tests with the value as the subject.

            const subjectObj = subject(subjectStr, value);

            if (!req.permissions.can(AbilityAction.Read, subjectObj)) {
                logger.verbose("Failed basic ReadOne rule test with value as subject.");
                req.passed = false;
                return null;
            }

            // In GQL contexts, fields were determined pre-resolver. In other contexts, we can only determine them
            //  post-resolver, which is done here.
            if (!(context instanceof GraphQLResolverArgs) && context.getType<GqlContextType>() !== "graphql") {
                Object.keys(value).forEach((v) => fields.add(v));

                // Remove any specifically excluded fields from the list of fields.
                if (rule.options?.excludeFields) {
                    rule.options.excludeFields.forEach((v) => fields.delete(v));
                }
            }

            // Test the ability against each requested field with subject value.
            for (const field of fields) {
                if (!req.permissions.can(AbilityAction.Read, subjectObj, field)) {
                    logger.verbose(`Failed field-based ReadOne rule test for field "${field}" with value as subject.`);
                    req.passed = false;
                    return null;
                }
            }

            req.passed = true;
            return value;
        })
    );
}
