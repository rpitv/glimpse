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
 * Rule function that can be used to define a rule for a given controller handler. The rule function takes the current
 *  execution context, the rule definition, and the handler function as arguments. The handler function calls the next
 *  RuleFn in the chain, or the controller if there are no more RuleFns, and returns an {@link Observable} that emits
 *  the result of the handler. This function is expected to then return an {@link Observable} which emits the result to
 *  be returned to the previous handler in the chain, or to the user if there are no handlers further up. If you want a
 *  rule to pass, then you must also set {@link Express.Request#passed} to true. This marks the request as having passed
 *  the rule check, and allows {@link CaslInterceptor} to call the next handler in the chain, and/or to return the value
 *  returned by this function. If {@link Express.Request#passed} is false or undefined, then {@link CaslInterceptor}
 *  will throw a ForbiddenException.
 */
export type RuleHandler<T = any> = (
    context: ExecutionContext | GraphQLResolverArgs,
    rule: RuleDef,
    handler: () => Observable<T>,
    caslHelper: CaslHelper
) => Observable<T>;

/**
 * Valid rule definitions. Rules can either be defined as a {@link RuleType.Custom} rule that uses a function to
 *  check permissions, or as one of the built-in rule types that takes in an {@link AbilitySubjects} as the subject, so
 *  the handler knows how to treat the value(s) in permission checks.
 */
export type RuleDef = {
    fn: RuleHandler;
    subject: AbilitySubjects;
    options?: RuleOptions;
};

/**
 * Valid types of rules that can be defined. If you want to define a rule other than this, then you should use
 *  {@link RuleType.Custom} and define a custom rule function. If a custom rule is being used frequently, it can be
 *  added to this enum and the handler can be defined and linked within {@link CaslHelper}. The method definitions for
 *  the built-in rules are the same as definitions for {@link RuleType.Custom} rules (i.e., they are all valid
 *  {@link RuleHandler}s).
 */
export enum RuleType {
    ReadOne = "ReadOne",
    ReadMany = "ReadMany",
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
    Count = "Count"
}

export const ruleHandlers: Map<RuleType, RuleHandler> = new Map([
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
     *  Currently, strict mode only applies to {@link RuleType.ReadMany} rules. For all other rule types, a
     *  ForbiddenException will be thrown as soon as any rule check fails, regardless of strict mode. Custom rules can
     *  also implement strict mode, if desired, of course. Check those rules' documentation for more information on how
     *  it is applied.
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

const registeredHandlers: { [key: string]: RuleHandler } = {};

export function getRuleHandlerId(handler: RuleHandler): string {
    let hashResult = crypto.createHash("md5").update(handler.toString()).digest("hex");
    // In the event of a hash collision, hash the hash until we get a unique hash.
    while (registeredHandlers[hashResult] && registeredHandlers[hashResult] !== handler) {
        hashResult = crypto.createHash("md5").update(hashResult).digest("hex");
    }
    return hashResult;
}

export function getRuleHandler(id: string): RuleHandler | null {
    return registeredHandlers[id] || null;
}

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
 *  {@link RuleType} and a {@link AbilitySubjects} subject. The rule will use the built-in rule handlers for the given
 *  {@link RuleType} to check if the user has permission to perform the given action on the given subject. If not, then
 *  a ForbiddenException will be thrown by {@link CaslInterceptor}.
 *
 *  The controller method will be called by this rule handler. In the case of {@link RuleType.ReadMany}, the value
 *  returned by the resolver/controller handler may be modified if {@link RuleOptions#strict} is set to false.
 *
 *  If you want to perform your own permission checks within the controller method, you can set
 *  {@link Express.Request#passed} to <pre>false</pre> within the controller method. This will tell the rule handler
 *  that the rule check has failed, and a ForbiddenException will be thrown by {@link CaslInterceptor} as soon as the
 *  resolver/controller handler returns.
 * @param type Type of rule to define. For this overload, this must not be {@link RuleType.Custom}.
 * @param subject {@link AbilitySubjects} subject to check permission for.
 * @param options Optional {@link RuleOptions} to configure this rule.
 * @constructor
 * @param handler
 * @param subj
 * @param options
 * @constructor
 */
export function Rule(handler: RuleHandler | RuleType, subj: AbilitySubjects, options?: RuleOptions) {
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
    console.log(optionsAstString);
    return Directive(`@rule(id: "${handlerId}", subject: ${subjStr}${optionsAstString})`);
}
