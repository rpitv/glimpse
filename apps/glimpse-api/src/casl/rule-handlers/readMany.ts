/**
 * Handle a {@link Rule} definition with rule type {@link RuleType.ReadMany}. This function ensures that the user
 *  has permission to read an array of resources of the given type, and intercepts the returned values from the
 *  resolver/handler that it is applied to, to make sure the user has permission to read all the returned values.
 *
 *  In addition to traditional subject/field permission checks, ReadMany rules also allow for the use of sorting,
 *  filtering, and pagination. These permissions are handled as such:
 *
 *  - <b>Sorting:</b> The user must have {@link AbilityAction.Sort} permission on the field being sorted by. The
 *    user's ability to read the field(s) being sorted is not currently taken into account. As such, it is possible
 *    for a user to infer some information about fields which they cannot read as long as they have permission to
 *    sort by them. With combinations of subsequent sorts, the user may be able to decipher the value completely.
 *  - <b>Filtering:</b> The user must have {@link AbilityAction.Filter} permission on the field being filtered by.
 *    The user's ability to read the individual field(s) being filtered is not currently taken into account. As
 *    such, it is possible for a user to infer some information about fields which they cannot read as long as they
 *    have permission to filter by them. With complex and combinations of filters, the user may be able to decipher
 *    the value completely.
 *  - <b>Pagination:</b> Generally, there are no permission checks against permission necessary. However, if the
 *    user is using cursor-based pagination, they must have permission to sort by the "ID" field. This is because
 *    cursor-based pagination requires sorting by some field by its very nature, and the "ID" field is the only
 *    field which Glimpse currently allows to be used for this. For skip-based pagination, there are no permission
 *    checks.
 *
 *  Currently, sorting and filtering permissions cannot have conditions applied to them. It is expected that any
 *  sorting or filtering permissions that the user has, do not have conditions applied. If they do, the conditions
 *  will currently be ignored and the user will be able to sort or filter by the field regardless of the conditions.
 *
 *  The current user's permissions are determined by the {@link Express.Request#permissions} property within the
 *  current NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this
 *  value.
 *
 *  If the user does not have permission to read the resources, then this method sets {@link Express.Request#passed}
 *  to false on the context's request object and returns null, potentially before calling the handler. From there,
 *  the {@link CaslInterceptor} will see that {@link Request#passed} is false and throw an error.
 *  {@link Express.Request#passed} can also be set to false by the resolver/handler that this rule is applied to,
 *  which stops the rule checks and immediately returns back to the {@link CaslInterceptor}.
 *
 *  Options can be supplied to this function to change the behavior of the rule checks within the {@link RuleDef}
 *  argument. Namely, strict mode currently applies exclusively to this rule type, allowing you to control what
 *  happens when the user doesn't have permission to read a field only on a subset of values of the requested type.
 *
 * @see {@link RuleOptions}
 * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
 *
 * @typeParam T - The type of the array of values expected to be returned by the resolver/handler which this rule
 *  is being applied to. E.g., if the resolver returns an array of {@link User| Users}, T would be {@link User}.
 *  Currently, this must be an instance of a valid {@link AbilitySubjects} type. This requirement may no longer be
 *  required.
 * @param context - NestJS execution context.
 * @param rule - Rule to test. If rule type is {@link RuleType.Custom}, an error will be thrown.
 * @param handler - The handler that calls the request method/resolver, or the next rule/interceptor in line if
 *  applicable. This is called after the necessary rule checks pass, and then additional checks are applied to the
 *  return value.
 * @returns The value returned from the handler, or null if the rule checks fail. If the rule's strict mode is
 *  enabled, then this will return null if the user doesn't have permission to read one or more of the fields on
 *  any object within the array returned by handler. However, if the rule's strict mode is disabled, then those
 *  fields will be set to null on the relevant objects. Note that if the user doesn't have permission to read the
 *  field on <i>any</i> object of the given type, the same behavior as strict mode will occur. That is, null will
 *  be returned and {@link Express.Request#passed} will be set to false. It is only when the user has permission to
 *  read the field on some objects of the given type that the strict mode behavior will differ.
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

const logger = new Logger("ReadManyRuleHandler");

export function handleReadManyRule<T extends Exclude<AbilitySubjects, string>>(
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<T[] | null>,
    caslHelper: CaslHelper
): Observable<T[] | null> {
    logger.debug("Handling ReadMany rule.");
    // Asserts that the rule is not a RuleType.Custom rule.
    const { req, subjectStr } = caslHelper.getReqAndSubject(context, rule);

    // Basic test with the provided action and subject.
    if (!req.permissions.can(AbilityAction.Read, subjectStr)) {
        logger.verbose("Failed basic ReadMany rule test.");
        req.passed = false;
        return of(null);
    }

    // Make sure user has permission to sort by the fields which they are sorting by.
    if (!caslHelper.canSortByFields(context, req, subjectStr, rule.options?.orderInputName ?? "order")) {
        logger.verbose("User doesn't have permission to sort by one or more of their supplied sorting arguments.");
        req.passed = false;
        return of(null);
    }

    // Make sure user has permission to filter by the fields which they are filtering by.
    if (!caslHelper.canFilterByFields(context, req, subjectStr, rule.options?.filterInputName ?? "filter")) {
        logger.verbose("User doesn't have permission to filter by one or more of their supplied filters.");
        req.passed = false;
        return of(null);
    }

    if (
        !caslHelper.canPaginate(context, req.permissions, subjectStr, rule.options?.paginationInputName ?? "pagination")
    ) {
        logger.verbose(
            `User supplied cursor-based pagination argument(s) but doesn't have permission to sort by ID on the 
                    subject "${subjectStr}".`
        );
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
            if (!req.permissions.can(AbilityAction.Read, subjectStr, field)) {
                logger.verbose(`Failed field-based ReadMany rule test for field "${field}".`);
                req.passed = false;
                return of(null);
            }
        }
    }

    // Call next rule, or resolver/handler if no more rules.
    return handler().pipe(
        map((values) => {
            // Handler already marked the request as failed for some permission error.
            if (req.passed === false) {
                logger.verbose("Failed ReadMany rule test. Handler already marked as failed.");
                return null;
            }

            // If the value is nullish, there's no value to check, so just return null.
            if (values === null || values === undefined) {
                req.passed = true;
                return null;
            }

            // Repeat previous tests with the values as the subject.

            for (const value of values) {
                const subjectObj = subject(subjectStr, value);
                if (!req.permissions.can(AbilityAction.Read, subjectObj)) {
                    logger.verbose("Failed basic ReadMany rule test on one or more values.");
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
                        // Strict mode will cause the entire request to fail if any field fails. Otherwise, the field
                        //  will be set to null. The user won't necessarily know (as of now) whether the field is
                        //  actually null, or they just can't read it.
                        if (rule.options?.strict ?? false) {
                            logger.verbose(
                                `Failed field-based ReadMany rule test for field "${field}" on one or more values.`
                            );
                            req.passed = false;
                            return null;
                        } else {
                            logger.verbose(
                                `Failed field-based ReadMany rule test for field "${field}" on one value. More may come...`
                            );
                            value[field] = null;
                        }
                    }
                }
            }

            req.passed = true;
            return values;
        })
    );
}
