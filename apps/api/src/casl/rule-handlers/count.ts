/**
 * Handle a {@link Rule} definition with rule type {@link RuleType.Count}. This function ensures that the user
 *  has permission to read at least one resource of the given type, as count resolvers should only be returning the
 *  count of resources the user has permission to read (as well as match their supplied filter).
 *
 *  The user must have {@link AbilityAction.Filter} permission on the field being filtered by. The user's
 *  ability to read the individual field(s) being filtered is not currently taken into account. As such, it is
 *  possible for a user to infer some information about fields which they cannot read as long as they have
 *  permission to filter by them. With complex and combinations of filters, the user may be able to decipher the
 *  value completely.
 *
 *  Currently, filtering permissions cannot have conditions applied to them. It is expected that any sorting or
 *  filtering permissions that the user has, do not have conditions applied. If they do, the conditions will
 *  currently be ignored and the user will be able to sort or filter by the field regardless of the conditions.
 *
 *  The current user's permissions are determined by the {@link Express.Request#permissions} property within the
 *  current NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this
 *  value.
 *
 *  If the user does not have permission to read the resource type, then this method sets
 *  {@link Express.Request#passed} to false on the context's request object and returns null, potentially before
 *  calling the handler. From there, the {@link CaslInterceptor} will see that {@link Request#passed} is false and
 *  throw an error. {@link Express.Request#passed} can also be set to false by the resolver/handler that this rule
 *  is applied to, which stops the rule checks and immediately returns back to the {@link CaslInterceptor}.
 *
 *  Options can be supplied to this function to change the behavior of the rule checks within the {@link RuleDef}
 *  argument.
 *
 * @see {@link RuleOptions}
 * @see {@link https://github.com/rpitv/glimpse/wiki/API-Authorization}
 *
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
import { ExecutionContext, Logger } from "@nestjs/common";
import { GraphQLResolverArgs } from "../../gql/graphql-resolver-args.class";
import { RuleDef } from "../rule.decorator";
import { Observable, of, tap } from "rxjs";
import { AbilityAction } from "../casl-ability.factory";
import { CaslHelper } from "../casl.helper";

const logger = new Logger("CountRuleHandler");

export function handleCountRule(
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<number | null>,
    caslHelper: CaslHelper
): Observable<number | null> {
    logger.debug("Handling Count rule.");
    // Asserts that the rule is not a RuleType.Custom rule.
    const { req, subjectStr } = caslHelper.getReqAndSubject(context, rule);

    // Basic test with the provided action and subject.
    if (!req.permissions.can(AbilityAction.Read, subjectStr)) {
        logger.verbose("Failed basic Count rule test.");
        req.passed = false;
        return of(null);
    }

    // Make sure user has permission to filter by the fields which they are filtering by.
    if (!caslHelper.canFilterByFields(context, req, subjectStr, rule.options?.filterInputName ?? "filter")) {
        logger.verbose("User doesn't have permission to filter by one or more of their supplied filters.");
        req.passed = false;
        return of(null);
    }

    // No permission checks need to be applied to the returned value (it's just a number), so return it.
    return handler().pipe(tap(() => (req.passed = true)));
}
