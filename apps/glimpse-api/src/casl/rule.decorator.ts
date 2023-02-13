import { AbilitySubjects } from "./casl-ability.factory";
import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { Observable } from "rxjs";
import { GraphQLEnumType } from "graphql/type";
import { GraphQLResolverArgs } from "../generic/graphql-resolver-args.class";

/**
 * Rule function that can be used to define a rule for a given resolver/controller handler. The rule function takes
 *  the current execution context, the rule definition, and the handler function as arguments. The handler function
 *  calls the next handler in the chain and returns an {@link Observable} that emits the result of the handler. This
 *  function is expected to then return an {@link Observable} which emits the result to be returned to the previous
 *  handler in the chain, or to the user if there are no handlers further up. If you want a rule to pass, then you
 *  must also set {@link Express.Request#passed} to true. This marks the request as having passed the rule check, and
 *  allows {@link CaslInterceptor} to call the next handler in the chain, and/or to return the value returned by this
 *  function. If {@link Express.Request#passed} is false or undefined, then {@link CaslInterceptor} will throw a
 *  ForbiddenException.
 */
export type RuleFn<T = any> = (
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<T>
) => Observable<T>;

/**
 * Valid rule definitions. Rules can either be defined as a {@link RuleType.Custom} rule that uses a function to
 *  check permissions, or as one of the built-in rule types that takes in an {@link AbilitySubjects} as the subject, so
 *  the handler knows how to treat the value(s) in permission checks.
 */
export type RuleDef =
    | [RuleType.Custom, RuleFn, RuleOptions?]
    | [Exclude<RuleType, RuleType.Custom>, AbilitySubjects, RuleOptions?];

/**
 * Valid types of rules that can be defined. If you want to define a rule other than this, then you should use
 *  {@link RuleType.Custom} and define a custom rule function. If a custom rule is being used frequently, it can be
 *  added to this enum and the handler can be defined within {@link CaslHelper} and linked in {@link CaslInterceptor}.
 *  The method definitions for the built-in rules are the same as definitions for {@link RuleType.Custom} rules.
 */
export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Count = "Count",
    Custom = "Custom"
}

/**
 * Create a GraphQL enum type for the {@link RuleType} enum.
 */
export const GraphQLRuleType = new GraphQLEnumType({
    name: "RuleType",
    values: Object.keys(RuleType).reduce((values, type) => {
        values[type] = { value: type };
        return values;
    }, {})
});

/**
 * Options that can be passed to a rule decorator to configure the rule.
 */
export type RuleOptions = {
    /**
     * Name of the rule. If not provided, the rule's name will be inferred from the rule's type and subject.
     *  To specifically mark a rule as unnamed, set this to an empty string or null, and "Unnamed rule" will be used
     *  as the rule's name.
     */
    name?: string;
    /**
     * Fields to exclude from field-based permission checks.
     * @example If this is set to ["id"], then the rule should not check that the user has permission to read the
     *  "id" field of the subject, and it should be returned even if the user does not normally have permission to read
     *  it.
     */
    excludeFields?: string[];
    /**
     * Name of the sorting/ordering input argument. This is used to make sure the user has permission to sort by the
     *  fields they are trying to sort by. This should be equal to the argument name that is used by the
     *  resolver/controller handler to get the sorting/ordering input. If not, then the rule will not be able to verify
     *  that the user has permission to sort by the fields they are trying to sort by.
     * @default "order"
     */
    orderInputName?: string;
    /**
     * Name of the filtering input argument. This is used to make sure the user has permission to filter by the fields
     *  they are trying to filter by. This should be equal to the argument name that is used by the resolver/controller
     *  handler to get the filtering input. If not, then the rule will not be able to verify that the user has
     *  permission to filter by the fields they are trying to filter by.
     * @default "filter"
     */
    filterInputName?: string;
    /**
     * Name of the pagination input argument. Pagination by cursor requires permission to sort by the ID field, so
     *  if a pagination object with the "cursor" property is provided, then the rule handler should check that the user
     *  has permission to sort by the ID field.
     * @default "pagination"
     */
    paginationInputName?: string;
    /**
     * Name of the input argument that contains the data to be created/updated. This is used to make sure the user has
     *  permission to create/update the fields they are trying to create/update. This should be equal to the argument
     *  name that is used by the resolver/controller handler to get the input data. If not, then the rule will not be
     *  able to verify that the user has permission to create/update the fields they are trying to create/update.
     * @default "input"
     */
    inputName?: string;
    /**
     * Strict mode allows you to make an entire request fail if any of the rule checks fail. If this is set to false
     *  (the default), then the request will continue, but the fields that the user does not have permission to read
     *  will be set to null. If this is set to true, then the request will fail and a ForbiddenException will be thrown
     *  as soon as any rule check fails.
     *
     *  This only applies to value-based rule checks on a field. If a user requests a field, but they don't have
     *  permission to read that field on <i>any</i> object, then a ForbiddenException will be thrown regardless of
     *  whether strict mode is enabled or not. Similarly, if a user requests a subject type which they don't have
     *  permission to read, then a ForbiddenException will be thrown.
     *
     *  Currently, strict mode only applies to {@link RuleType.ReadMany} rules. For all other rule types, a
     *  ForbiddenException will be thrown as soon as any rule check fails, regardless of strict mode. Custom rules can
     *  also implement strict mode, if desired, of course. Check those rules' documentation for more information on how
     *  it is applied.
     * @default false
     */
    strict?: boolean;
};
export const RULES_METADATA_KEY = "casl_rule";

/**
 * Decorator that defines a permission requirement (rule) for a given resolver/controller handler. The rule is defined
 *  as a function {@link RuleFn} which takes in the NestJS execution context, the rule definition {@link RuleDef}, and
 *  the handler function that calls the next rule, or the resolver/controller handler if this is the last rule. The
 *  handler function returns an {@link Observable} which can be used to modify the response before it is returned to
 *  the client/the previous rule that called this one.
 * @param type Type of rule to define. For custom rules, this must be {@link RuleType.Custom}.
 * @param fn {@link RuleFn} to run for this rule. If you want a rule to pass, then you must also set
 *  {@link Express.Request#passed} to true within this function. This marks the request as having passed the rule check,
 *  and allows {@link CaslInterceptor} to call the next handler in the chain, and/or to return the value returned by
 *  this function. If {@link Express.Request#passed} is false or undefined, then {@link CaslInterceptor} will throw a
 *  ForbiddenException.
 * @param options Optional {@link RuleOptions} to configure this rule.
 * @constructor
 */
function Rule(type: RuleType.Custom, fn: RuleFn, options?: RuleOptions);
/**
 * Decorator that defines a permission requirement (rule) for a given resolver/controller handler. The rule is defined
 *  as a {@link RuleType} and a {@link AbilitySubjects} subject. The rule will use the built-in rule handlers for the
 *  given {@link RuleType} to check if the user has permission to perform the given action on the given subject. If not,
 *  then a ForbiddenException will be thrown by {@link CaslInterceptor}.
 *
 *  The resolver/controller handler will be called by this rule handler. In the case of {@link RuleType.ReadMany},
 *  the value returned by the resolver/controller handler may be modified if {@link RuleOptions#strict} is set to
 *  false.
 *
 *  If you want to perform your own permission checks within the resolver/controller handler, you can set
 *  {@link Express.Request#passed} to <pre>false</pre> within the controller/handler. This will tell the rule handler
 *  that the rule check has failed, and a ForbiddenException will be thrown by {@link CaslInterceptor} as soon as the
 *  resolver/controller handler returns.
 * @param type Type of rule to define. For this overload, this must not be {@link RuleType.Custom}.
 * @param subject {@link AbilitySubjects} subject to check permission for.
 * @param options Optional {@link RuleOptions} to configure this rule.
 * @constructor
 */
function Rule(type: Exclude<RuleType, RuleType.Custom>, subject: AbilitySubjects, options?: RuleOptions);
/**
 * Define multiple rules for a given resolver/controller handler. The @Rule decorator cannot be used multiple times
 *  on a single method, so if you want to define multiple rule requirements, this is the primary way to do so. Rules are
 *  checked in the order that they are defined.
 * @example If you have two rules defined, then {@link CaslInterceptor} will call them as follows:
 * ... -> Rule 1 -> Rule 2 -> Resolver/Controller Handler -> Rule 2 -> Rule 1 -> ...
 * @param rules Array of {@link RuleDef} objects to define the rules.
 * @constructor
 */
function Rule(rules: RuleDef[]);
function Rule(...args: any) {
    // Multiple rule definitions supplied
    if (Array.isArray(args[0])) {
        return SetMetadata<string, RuleDef[]>(RULES_METADATA_KEY, args[0]);
    }

    // Single rule definition supplied
    args[2] ||= {};
    return SetMetadata<string, RuleDef[]>(RULES_METADATA_KEY, [args]);
}

export { Rule };
