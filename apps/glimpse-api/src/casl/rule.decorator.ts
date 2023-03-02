import { AbilitySubjects } from "./casl-ability.factory";
import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { GraphQLResolverArgs } from "../gql/graphql-resolver-args.class";
import { Directive } from "@nestjs/graphql";
import { CaslHelper } from "./casl.helper";
import { handleReadOneRule } from "./rule-handlers/readOne";
import { handleReadManyRule } from "./rule-handlers/readMany";
import { handleCreateRule } from "./rule-handlers/create";
import { handleUpdateRule } from "./rule-handlers/update";
import { handleDeleteRule } from "./rule-handlers/delete";
import { handleCountRule } from "./rule-handlers/count";
import * as crypto from "crypto";

/**
 * Rule handler that performs checks to make sure a user has permission to access/use a resolver before and after
 *  execution. The rule handler takes the current context, the rule definition, and the next handler in the chain, and
 *  an instance of CaslHelper as arguments. If there are no more rule handlers in the chain, then the next handler is
 *  the resolver. The next function returns an {@link Observable} that emits the result of the next handler/resolver.
 *  This function is expected to then return an {@link Observable} which emits the result to be returned to the previous
 *  handler in the chain, or to the user if there are no handlers further up.
 *
 *  After calling the next handler, your {@link RuleHandler} should check that {@link Express.Request#passed} is not
 *  false before continuing. If it is, then the next handler's rule checks failed, and your {@link RuleHandler} should
 *  throw an error. This system can be improved in the future.
 */
export type RuleHandler<T = any> = (
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    next: () => Observable<T>,
    caslHelper: CaslHelper
) => Observable<T>;

/**
 * Data structure for a rule definition. A rule definition is a combination of a {@link RuleHandler}, a subject, and
 *  options. The subject is passed to the {@link RuleHandler} at runtime. The subject can be null if the
 *  {@link RuleHandler} does not take the subject into account. Otherwise, the subject should be a valid
 *  {@link AbilitySubjects} value.
 */
export type RuleDef = {
    fn: RuleHandler;
    subject: AbilitySubjects | null;
    options?: RuleOptions;
};

/**
 * A set of built-in rule types that can be used to quickly refer to a {@link RuleHandler}. Functionally,
 *  {@link RuleType}s are just strings which are mapped to {@link RuleHandler}s under the hood. There is no
 *  implementation difference between using a {@link RuleType} and using a {@link RuleHandler} directly. If you find
 *  that you are using a {@link RuleHandler} directly frequently, it may make sense to create a {@link RuleType} for
 *  it, so that you can refer to it by name instead of having to import the {@link RuleHandler} function.
 *  @see {@link ruleHandlers} for where the {@link RuleType}s are mapped to {@link RuleHandler}s.
 */
export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Count = "Count"
}

const ruleHandlers: Map<RuleType, RuleHandler> = new Map([
    [RuleType.ReadOne, handleReadOneRule],
    [RuleType.ReadMany, handleReadManyRule],
    [RuleType.Create, handleCreateRule],
    [RuleType.Update, handleUpdateRule],
    [RuleType.Delete, handleDeleteRule],
    [RuleType.Count, handleCountRule]
]);

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
     *  Currently, for the built-in rule types, strict mode only applies to {@link RuleType.ReadMany} rules. For all
     *  other rule types, a ForbiddenException will be thrown as soon as any rule check fails, regardless of strict
     *  mode. Custom {@link RuleHandler}s should, but are not required to, also abide by the same guidelines. Check
     *  those rules' documentation for more information on how it is applied.
     * @default false
     */
    strict?: boolean;
    /**
     * Defer rule checks until after the resolver has run. This is useful for when a user's permissions are modified
     *  within the resolver, and you only want to respect the permissions post-resolution (e.g. a login resolver).
     *  This will result in the resolver being called 100% of the time, barring some error.
     *  @example See {@link AuthResolver} for an example of this in use. Users are able to request details about
     *  themselves that they wouldn't have permission to read as a guest, however they can read after being logged in.
     *  Deferring the rule checks until after the resolver runs allows us to check the user's permissions after they
     *  have been modified by the login resolver.
     */
    defer?: boolean;
};

/**
 * Map of rule handler IDs to the corresponding registered {@link RuleHandler}s.
 */
const registeredHandlers: { [key: string]: RuleHandler } = {};

/**
 * Perform an MD5 hash on a string. This should not be used for security purposes, as md5 is not considered secure.
 * @param str String to hash.
 * @returns The MD5 hash of the string.
 */
function md5(str: string): string {
    return crypto.createHash("md5").update(str).digest("hex");
}

/**
 * Compute the automatic ID of a {@link RuleHandler}. This is used to register the handler, when a custom name isn't
 *  provided. The ID is computed by hashing the handler's function body, and if a hash collision occurs, the hash is
 *  hashed again until a unique hash is found.
 * @param handler Handler function to compute the ID of.
 * @returns The ID of the handler.
 */
export function getRuleHandlerId(handler: RuleHandler): string {
    let hashResult = md5(handler.toString());
    // In the event of a hash collision, hash the hash until we get a unique hash.
    while (registeredHandlers[hashResult] && registeredHandlers[hashResult] !== handler) {
        hashResult = md5(hashResult);
    }
    return hashResult;
}

/**
 * Get the {@link RuleHandler} for the provided {@link RuleType}. These are considered "built-in" handlers, and can be
 *  referenced quickly within {@link Rule} decorator calls via their {@link RuleType} value. Generally, you do not need
 *  to use this method directly, as {@link Rule} will deal with that for you. However, if you need to get the actual
 *  handler function for some reason, you can use this method to do so.
 * @param ruleType The {@link RuleType} to get the handler for.
 * @returns The {@link RuleHandler} for the provided {@link RuleType}. It is considered an error if a RuleType doesn't
 *  have a corresponding handler, and this should never happen.
 */
export function getRuleHandlerForRuleType(ruleType: RuleType): RuleHandler {
    return ruleHandlers.get(ruleType);
}

/**
 * Get the {@link RuleHandler} that has been registered under the provided ID. If no handler has been registered
 *  under the provided ID, null will be returned.
 * @param id The ID of the handler to get.
 * @returns The {@link RuleHandler} that has been registered under the provided ID, or null if no handler has been
 *  registered under the provided ID.
 * @see {@link registerHandler}
 */
export function getRuleHandler(id: string): RuleHandler | null {
    return registeredHandlers[id] || null;
}

/**
 * Register a {@link RuleHandler} to be used with the {@link Rule} decorator. If a name is provided, the handler will
 *  be registered under that name. Otherwise, the handler will be registered under a hash of its function body.
 * @param handler The handler to register. Should be a callable function that corresponds with the {@link RuleHandler}
 *  type.
 * @param name Optional name to register the handler under. If not provided, the handler will be registered under a
 *  hash of its function body. If a name is provided but a handler has already been registered under that name, an
 *  error will be thrown.
 * @returns The name under which the handler was registered. Also referred to as its ID. In the event of a hash
 *  collision, this will recursively hash the hash until a unique hash is found.
 * @throws Error if a handler has already been registered under the provided name.
 * @see {@link getRuleHandlerId}
 * @see {@link getRuleHandler}
 */
export function registerHandler(handler: RuleHandler, name?: string): string {
    if (name !== undefined) {
        if (registeredHandlers[name]) {
            throw new Error(`A handler with the name "${name}" has already been registered.`);
        }
        registeredHandlers[name] = handler;
        return name;
    }
    const hash = getRuleHandlerId(handler);
    registeredHandlers[hash] = handler;
    return hash;
}

/**
 * Create a GraphQL AST input string from an object. This is used to create the input for the automatically-generated
 *  GraphQL @rule directive, where GraphQL input objects are used. Essentially, this is equivalent to
 *  {@link JSON#stringify} but with the quotations around the keys removed.
 * @param obj Object to convert to a GraphQL-compatible AST input object as a string.
 */
function createAstInputFromObject(obj: Exclude<unknown, undefined>): string {
    let output = "";

    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
        return JSON.stringify(obj);
    } else if (Array.isArray(obj)) {
        return `[${obj.map((val) => createAstInputFromObject(val)).join(", ")}]`;
    } else if (obj === null) {
        return "null";
    } else {
        output += "{";

        for (const key of Object.keys(obj)) {
            output += `${key}: ${createAstInputFromObject(obj[key])}, `;
        }
        output = output.slice(0, -2);

        output += "}";
    }

    return output;
}

/**
 * Decorator that defines a permission requirement (rule) to the relevant GraphQL resolver. The rule is defined as a
 *  {@link RuleType} or {@link RuleHandler} and optionally a {@link AbilitySubjects} subject.
 *
 * This decorator can only be applied to GraphQL resolvers, not HTTP controllers. If you need to apply rules to an
 *  HTTP controller, please open an issue to extend the implementation of this decorator to allow for that. For a
 *  partial implementation, see the old @Rule decorator implemented with an interceptor at
 *  {@link https://github.com/rpitv/glimpse-api/tree/03f73f9db27959b07ad83028ae4521187b153ba6/src/casl}. This
 *  interceptor was deprecated and removed due to being untested and not being needed. For more information, please
 *  read the wiki.
 *
 *  The resolver method will be called by the rule handler if its rule checks pass. It is also possible for the rule
 *  handler to apply checks on the return result of the resolver. If those rule checks fail, any mutations made within
 *  the resolver will be rolled back.
 *
 *  Rule handlers are free to also mutate the return result from the resolver. Of the built-in {@link RuleType}s, the
 *  only one that mutates the result is {@link RuleType.ReadMany}. If {@link RuleOptions#strict} is set to true, then
 *  rule handlers should not mutate the result, instead completely failing the request by throwing an error.
 *
 *  If you want to perform your own permission checks within the resolver, you can set {@link Express.Request#passed}
 *  to <pre>false</pre> within the controller method. This will tell the rule handler that the rule check has failed,
 *  and a ForbiddenException should be thrown by the rule handler as soon as the resolver returns.
 *
 *  TODO Setting {@link Express.Request#passed} to <pre>false</pre> will currently have no effect if there are no rules
 *   applied to the resolver.
 * @param handler The {@link RuleHandler} function implementation to use for this rule. Alternatively, a
 *  {@link RuleType} may be provided, in which case the default rule handler for that type will be used.
 * @param subj {@link AbilitySubjects} subject to check permission for. May be null, however some rule handlers may
 *  require a non-null subject and throw an error when a null subject is provided.
 * @param options Optional {@link RuleOptions} to configure this rule.
 */
export function Rule(handler: RuleHandler | RuleType, subj: AbilitySubjects | null, options?: RuleOptions) {
    if (typeof handler !== "function") {
        const strHandler = handler as RuleType;
        handler = ruleHandlers.get(handler);
        if (typeof handler !== "function") {
            throw new Error(
                `RuleHandler enum value must correspond to a matching ruleHandler function, but one ` +
                    `wasn't found for the value ${strHandler}.`
            );
        }
    }

    const handlerId = registerHandler(handler);

    // Determine the subject in string form
    let subjStr: Extract<AbilitySubjects, string> | "null";
    if (typeof subj === "string") {
        subjStr = subj;
    } else if (typeof subj === "function") {
        subjStr = subj.modelName;
    } else if (subj === null) {
        subjStr = "null";
    } else {
        subjStr = subj.constructor.name as Extract<AbilitySubjects, string>;
    }

    // Create AST structure for options
    let optionsAstString = "";
    if (options !== undefined) {
        optionsAstString = `, options: ${createAstInputFromObject(options)}`;
    }

    return Directive(`@rule(id: "${handlerId}", subject: ${subjStr}${optionsAstString})`);
}
