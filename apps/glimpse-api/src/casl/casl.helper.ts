import { ExecutionContext, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "./rules.decorator";
import { AbilityAction, AbilitySubjects, GlimpseAbility } from "./casl-ability.factory";
import { subject } from "@casl/ability";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql/type";
import { EnumValueNode, IntValueNode, Kind, visit } from "graphql/language";
import PaginationInput from "../generic/pagination.input";
import { map, Observable, of } from "rxjs";
import { Request } from "express";

@Injectable()
export class CaslHelper {
    /**
     * Keywords which are used to filter the results of a query. These keywords cannot be properites of
     *  a filterable object type.
     */
    public readonly filterKeywords = [
        "AND",
        "OR",
        "NOT",
        "contains",
        "startsWith",
        "endsWith",
        "in",
        "notIn",
        "lt",
        "lte",
        "gt",
        "gte",
        "equals",
        "not",
        "mode"
    ] as const;
    private readonly logger: Logger = new Logger("CaslHelper");

    constructor() {
        // I don't know why this is necessary, but without it, "this" is undefined within these methods.
        this.handleCountRule = this.handleCountRule.bind(this);
        this.handleCustomRule = this.handleCustomRule.bind(this);
        this.handleReadManyRule = this.handleReadManyRule.bind(this);
        this.handleReadOneRule = this.handleReadOneRule.bind(this);
        this.handleCreateRule = this.handleCreateRule.bind(this);
        this.handleUpdateRule = this.handleUpdateRule.bind(this);
        this.handleDeleteRule = this.handleDeleteRule.bind(this);
    }

    /**
     * Retrieve the Express Request object from the given execution context. Currently only supports GraphQL and
     *  HTTP execution contexts. If the execution context is set to something else, this will throw an Error.
     * @param context Execution context to retrieve the Request object from.
     * @throws Error if execution context type is not GraphQL or HTTP.
     */
    public getRequest(context: ExecutionContext): Request {
        if (context.getType<GqlContextType>() === "graphql") {
            this.logger.verbose("CASL interceptor currently in GraphQL context.");
            const gqlContext = GqlExecutionContext.create(context);
            return gqlContext.getContext().req;
        } else if (context.getType() === "http") {
            this.logger.verbose("CASL interceptor currently in HTTP context.");
            return context.switchToHttp().getRequest();
        } else {
            throw new Error(`CASL interceptor applied to unsupported context type ${context.getType()}`);
        }
    }

    /**
     * Recursively get all keys used within an object, including keys used within objects in an array.
     *  This is used to determine which fields are used in a filter.
     *
     * Example:
     *  { a: 1, b: "two", c: [ { d: 3, e: "four" }, { e: 5, f: "six" } ] }
     * will return a Set containing:
     *  "a", "b", "c", "d", "e", "f".
     *
     * @param obj Object to get keys of.
     * @returns Set of keys used in the object.
     */
    public getKeysFromDeepObject(obj: Record<any, any>): Set<string> {
        const keys = new Set<string>();
        for (const key of Object.keys(obj)) {
            keys.add(key);
            if (Array.isArray(obj[key])) {
                for (const item of obj[key]) {
                    this.getKeysFromDeepObject(item).forEach((k) => keys.add(k));
                }
            } else if (typeof obj[key] === "object") {
                this.getKeysFromDeepObject(obj[key]).forEach((k) => keys.add(k));
            }
        }
        return keys;
    }

    /**
     * Get the fields which the user is selecting from the GraphQL query info object. Resolvers will typically return
     *  the entire object, but the user may only be interested in a subset of the fields, which the GraphQL driver
     *  filters out.
     *  TODO basic field selection is supported, but inline fragments and fragment spreads are not.
     * @param info GraphQL query info object.
     * @returns Set of field names which the user is selecting.
     */
    public getSelectedFields(info: GraphQLResolveInfo): Set<string> {
        const fields = new Set<string>();
        for (const fieldNode of info.fieldNodes) {
            this.assertNodeKind(fieldNode, Kind.FIELD);

            for (const selection of fieldNode.selectionSet?.selections || []) {
                this.assertNodeKind(selection, [Kind.FIELD, Kind.INLINE_FRAGMENT, Kind.FRAGMENT_SPREAD]);
                if (selection.kind === Kind.FIELD) {
                    this.assertNodeKind(selection.name, Kind.NAME);
                    fields.add(selection.name.value);
                } else if (selection.kind === Kind.INLINE_FRAGMENT) {
                    // TODO
                    throw new Error('Unsupported selection Kind "INLINE_FRAGMENT"');
                } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
                    // TODO
                    throw new Error('Unsupported selection Kind "FRAGMENT_SPREAD"');
                }
            }
        }
        this.logger.debug(`User requested the following fields in their query: ${[...fields].join(", ")}`);
        return fields;
    }

    /**
     * Get the fields used to filter a ReadMany query. These fields are then used to make sure the user has
     *  permission to filter based on those fields.
     * @param context NestJS execution context.
     * @param argName Name of the filter argument in the GraphQL query.
     * @todo Filtering currently only supports GraphQL queries.
     * @returns Set of field names used to filter the query.
     */
    public getFilteringFields(context: ExecutionContext, argName: string): Set<string> {
        const contextType = context.getType<GqlContextType>();
        if (contextType === "graphql") {
            const info = this.getGraphQLInfo(context);

            const filteringFields = new Set<string>();
            for (const fieldNode of info.fieldNodes) {
                this.assertNodeKind(fieldNode, Kind.FIELD);

                const filterArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (filterArg === undefined) {
                    continue;
                }

                this.assertNodeKind(filterArg, Kind.ARGUMENT);
                this.assertNodeKind(filterArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                if (filterArg.value.kind === Kind.OBJECT) {
                    this.logger.verbose("Filtering argument passed in as AST.");
                    const filterAst = filterArg.value;
                    visit(filterAst, {
                        ObjectField: {
                            enter: (node) => {
                                const name = node.name.value;
                                if (this.filterKeywords.includes(name as any)) {
                                    return;
                                }
                                filteringFields.add(name);
                            }
                        }
                    });
                } else {
                    this.logger.verbose("Filtering argument passed in as variable.");
                    const argName = filterArg.name.value;
                    const filterObj = info.variableValues[argName];
                    this.getKeysFromDeepObject(filterObj).forEach((k) => {
                        if (!this.filterKeywords.includes(k as any)) {
                            filteringFields.add(k);
                        }
                    });
                }
            }
            this.logger.debug(
                `User filtered using the following fields in their query: ${[...filteringFields].join(", ")}`
            );
            return filteringFields;
        } else if (contextType === "http") {
            // TODO
            return new Set();
        } else {
            throw new Error("Unsupported execution context");
        }
    }

    /**
     * Check that the user has permission to paginate the supplied subject type. We need this because cursor-based
     *  pagination requires sorting by ID, and therefore to use it, the user needs to have permission to sort by ID.
     * @param context NestJS execution context.
     * @param ability GlimpseAbility instance.
     * @param subjectName Name of the subject to check permissions for.
     * @param argName Name of the pagination argument in the GraphQL query.
     * @todo Filtering currently only supports GraphQL queries.
     * @returns True if the user has permission to use the supplied pagination argument, false otherwise.
     */
    public canPaginate(
        context: ExecutionContext,
        ability: GlimpseAbility,
        subjectName: Extract<AbilitySubjects, string>,
        argName: string
    ): boolean {
        const contextType = context.getType<GqlContextType>();
        if (contextType === "graphql") {
            const info = this.getGraphQLInfo(context);

            for (const fieldNode of info.fieldNodes) {
                this.assertNodeKind(fieldNode, Kind.FIELD);

                const paginationArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (paginationArg === undefined || paginationArg === null) {
                    continue;
                }

                this.assertNodeKind(paginationArg, Kind.ARGUMENT);
                this.assertNodeKind(paginationArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                let paginationArgValue: PaginationInput | undefined;
                if (paginationArg.value.kind === Kind.OBJECT) {
                    this.logger.verbose("Pagination argument passed in as AST.");
                    const paginationAst = paginationArg.value;
                    const parsedPaginationValue: any = {};
                    visit(paginationAst, {
                        ObjectField: {
                            enter: (node) => {
                                // All pagination arguments are ints or null.
                                this.assertNodeKind(node.value, [Kind.INT, Kind.NULL]);
                                if (node.value.kind === Kind.INT) {
                                    parsedPaginationValue[node.name.value] = parseInt(
                                        (node.value as IntValueNode).value
                                    );
                                } else {
                                    parsedPaginationValue[node.name.value] = null;
                                }
                            }
                        }
                    });

                    if (parsedPaginationValue.take === undefined) {
                        throw new Error("Pagination requires a take argument.");
                    }
                    paginationArgValue = parsedPaginationValue;
                } else {
                    this.logger.verbose("Pagination argument passed in as variable.");
                    const argName = paginationArg.name.value;
                    if ((info.variableValues[argName] as any).take === undefined) {
                        throw new Error("Pagination requires a take argument.");
                    }
                    paginationArgValue = info.variableValues[argName] as PaginationInput;
                }

                if (paginationArgValue && typeof paginationArgValue.cursor === "number") {
                    if (!ability.can(AbilityAction.Sort, subjectName, "id")) {
                        return false;
                    }
                }
            }

            return true;
        } else if (contextType === "http") {
            // TODO
            throw new Error("Pagination via HTTP is not yet supported.");
        } else {
            throw new Error("Unsupported execution context");
        }
    }

    /**
     * Get the fields used to sort a ReadMany query. These fields are then used to make sure the user has
     *  permission to sort based on those fields.
     * @param context NestJS execution context.
     * @param argName Name of the sort/order argument in the GraphQL query.
     * @todo Sorting currently only supports GraphQL queries.
     * @returns Set of field names used to sort the query.
     */
    public getSortingFields(context: ExecutionContext, argName: string): Set<string> {
        const contextType = context.getType<GqlContextType>();
        if (contextType === "graphql") {
            const info = this.getGraphQLInfo(context);

            const sortingFields = new Set<string>();
            for (const fieldNode of info.fieldNodes) {
                this.assertNodeKind(fieldNode, Kind.FIELD);

                const sortArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (sortArg === undefined) {
                    continue;
                }

                this.assertNodeKind(sortArg, Kind.ARGUMENT);
                this.assertNodeKind(sortArg.value, [Kind.LIST, Kind.VARIABLE]);

                if (sortArg.value.kind === Kind.LIST) {
                    this.logger.verbose("Sorting argument passed in as AST.");
                    const sortAst = sortArg.value;
                    visit(sortAst, {
                        ObjectField: {
                            enter: (node) => {
                                if (node.name.value === "field") {
                                    this.assertNodeKind(node.value, Kind.ENUM);
                                    sortingFields.add((node.value as EnumValueNode).value);
                                }
                            }
                        }
                    });
                } else {
                    this.logger.verbose("Sorting argument passed in as variable.");
                    const argName = sortArg.name.value;
                    const sortValue = info.variableValues[argName];
                    if (!Array.isArray(sortValue)) {
                        throw new Error("Ordering value must be an array");
                    }
                    sortValue.forEach((sortObj) => {
                        sortingFields.add(sortObj.field);
                    });
                }
            }
            this.logger.debug(
                `User sorted using the following fields in their query: ${[...sortingFields].join(", ")}`
            );
            return sortingFields;
        } else if (contextType === "http") {
            // TODO
            return new Set();
        } else {
            throw new Error("Unsupported execution context");
        }
    }

    /**
     * Get the fields supplied in a Create/Update mutation. These fields are then used to make sure the user has
     *  permission to create/update an object based on those fields.
     * @param context NestJS execution context.
     * @param argName Name of the input data argument in the GraphQL query.
     * @todo Inputting data currently only supports GraphQL queries.
     * @returns Set of field names supplied in the input data.
     */
    public getInputFields(context: ExecutionContext, argName: string): Set<string> {
        const contextType = context.getType<GqlContextType>();
        if (contextType === "graphql") {
            const info = this.getGraphQLInfo(context);

            const inputFields = new Set<string>();
            for (const fieldNode of info.fieldNodes) {
                this.assertNodeKind(fieldNode, Kind.FIELD);

                const inputArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (inputArg === undefined) {
                    continue;
                }

                this.assertNodeKind(inputArg, Kind.ARGUMENT);
                this.assertNodeKind(inputArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                if (inputArg.value.kind === Kind.OBJECT) {
                    this.logger.verbose("Input argument passed in as AST.");
                    const inputAst = inputArg.value;
                    visit(inputAst, {
                        ObjectField: {
                            enter: (node) => {
                                // Only single-deep fields are allowed in input data at the moment. I.e., you cannot
                                //  create relations in a single mutation.
                                this.assertNodeKind(node.value, [
                                    Kind.ENUM,
                                    Kind.STRING,
                                    Kind.INT,
                                    Kind.BOOLEAN,
                                    Kind.FLOAT
                                ]);
                                inputFields.add(node.name.value);
                            }
                        }
                    });
                } else {
                    this.logger.verbose("Input argument passed in as variable.");
                    const argName = inputArg.name.value;
                    for (const fieldName of Object.keys(info.variableValues[argName])) {
                        // Only single-deep fields are allowed in input data at the moment. I.e., you cannot
                        //  create relations in a single mutation.
                        if (typeof info.variableValues[argName][fieldName] === "object") {
                            throw new Error("Input data cannot contain nested objects.");
                        }
                        inputFields.add(fieldName);
                    }
                }
            }
            this.logger.debug(`User input the following fields in their mutation: ${[...inputFields].join(", ")}`);
            return inputFields;
        } else if (contextType === "http") {
            // TODO
            return new Set();
        } else {
            throw new Error("Unsupported execution context");
        }
    }

    /**
     * Assert that a GraphQL node is of the expected type or types. If it is not, throw an error.
     *  This is used in the AST traversal code to ensure that the AST is in the expected format.
     *  An error is never expected to be thrown, however we should use this method to ensure that
     *  the developer did not make a mistake in the AST traversal code or not account for another
     *  feature of GraphQL.
     * @param node GraphQL node to check.
     * @param expectedKind Expected kind of the node. Can also be an array of Kinds, in which case
     *  the node must be one of the expected kinds.
     * @throws Error if the node is not of the expected kind.
     * @private
     */
    private assertNodeKind(node: { kind: Kind } | undefined, expectedKind: Kind | Kind[]): void {
        if (Array.isArray(expectedKind)) {
            if (!expectedKind.includes(node?.kind)) {
                // This should never happen.
                this.logger.error(
                    `Encountered unexpected Node Kind "${node?.kind || "undefined"}" \
                     when traversing AST. Expected Node to be one of the following: \
                     ${expectedKind.join(", ")}. Node definition: ${node}`
                );
                throw new InternalServerErrorException("Unexpected node type");
            }
        } else {
            if (node?.kind !== expectedKind) {
                // This should never happen.
                this.logger.error(
                    `Encountered unexpected Node Kind "${node?.kind || "undefined"}" \
                     when traversing AST. Expected Node to be ${expectedKind}. \
                     Node definition: ${node}`
                );
                throw new InternalServerErrorException("Unexpected node type");
            }
        }
    }

    /**
     * Get the GraphQL info object from the current execution context. If the execution context is not GraphQL, this
     *  will return null.
     * @param context NestJS execution context.
     * @returns GraphQL info object, or null if the execution context is not GraphQL.
     */
    private getGraphQLInfo(context: ExecutionContext): GraphQLResolveInfo {
        if (context.getType<GqlContextType>() !== "graphql") {
            return null;
        }
        const gqlContext = GqlExecutionContext.create(context);
        return gqlContext.getInfo<GraphQLResolveInfo>();
    }

    /**
     * Convert an AbilitySubject value into a string. Glimpse stores all subjects as strings within the database, so
     *  we must convert non-string AbilitySubject values into strings before passing them to CASL. This is
     *  accomplished by returning the static "modelName" property on classes if it exists, or the class name otherwise.
     * @param subj Subject to convert.
     * @returns String representation of the subject.
     * @private
     */
    public getSubjectAsString(subj: AbilitySubjects): Extract<AbilitySubjects, string> {
        // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
        //  to a string before testing. Typeof classes === function.
        if (typeof subj === "string") {
            return subj;
        } else if (typeof subj === "function") {
            return (subj.modelName || subj.name) as Extract<AbilitySubjects, string>;
        } else {
            throw new Error("Unknown subject type");
        }
    }

    /**
     * Test that the given ability has permission to perform the given rule. Rule is defined as a custom function
     *  set within the rule decorator. This function is almost as simple as just calling the rule's custom function,
     *  but it does perform a couple sanity checks before doing so.
     *
     * @typeParam T - The type of the value expected to be returned by the resolver/handler which this rule is being
     *  applied to.
     * @param context NestJS execution context.
     * @param rule Rule to test. If rule type is not Custom, or if the rule definition is not a RuleFn, an error will be
     *  thrown.
     * @param handler The handler that calls the request method/resolver, or the next interceptor in line if applicable.
     *  This is passed to the rule function, allowing the rule function to call the resolver at the appropriate time.
     * @returns The returned value from the rule function. Typically, this will be the value returned from the
     *  resolver/handler, but the rule function is allowed to mutate that value, or return a completely different value.
     *  Whatever is returned should be treated as the final value returned from the resolver/handler.
     * @throws Error if the rule type is not Custom, or if the rule definition is not a RuleFn.
     */
    public handleCustomRule<T = any>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T>
    ): Observable<T> {
        if (rule.type !== RuleType.Custom) {
            throw new Error(`Cannot test rule of type "${rule.type}" with testCustomRule.`);
        }
        if (typeof rule.rule !== "function") {
            throw new Error("Cannot test rule with a tuple with testCustomRule.");
        }

        return rule.rule(context, rule, handler);
    }

    /**
     * Test that the current user has permission to perform the given {@link Rule} within their {@link GlimpseAbility},
     *  and then call and return the passed handler's value if so. Permissions are also tested against the specific
     *  value that is returned by the handler, so it is possible for the handler to be called and the request still to
     *  fail if the user didn't have permission to read the specific value in question. For this reason, the
     *  resolvers/handlers which this rule handler is applied to should not have any mutating effects.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @typeParam T - The type of the value expected to be returned by the resolver/handler which this rule is being
     *  applied to. Currently, this must be an instance of a valid {@link AbilitySubjects} type.
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not ReadOne, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass, and then additional checks are applied to the
     *  return value.
     * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
     *  mutate the return value from the next handler.
     * @throws Error if the rule type is not {@link RuleType.ReadOne}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleReadOneRule<T extends Exclude<AbilitySubjects, string>>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T | null>
    ): Observable<T | null> {
        if (rule.type !== RuleType.ReadOne) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleReadOneRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleReadOneRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        const fields: Set<string> = new Set();
        // Field-based tests can only be done pre-resolver for GraphQL requests, since the request includes the
        //  fields to be returned. Non-GraphQL requests don't include this, as all fields are returned.
        if (context.getType<GqlContextType>() === "graphql") {
            const info = this.getGraphQLInfo(context);
            this.getSelectedFields(info).forEach((v) => fields.add(v));

            // Remove any specifically excluded fields from the list of fields.
            if (rule.options?.excludeFields) {
                rule.options.excludeFields.forEach((v) => fields.delete(v));
            }

            // Test the ability against each requested field
            for (const field of fields) {
                if (!req.permissions.can(action, subjectStr, field)) {
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
                    return null;
                }

                // If the value is nullish, there's no value to check, so just return null.
                if (value === null || value === undefined) {
                    req.passed = true;
                    return null;
                }

                // Repeat previous tests with the value as the subject.

                const subjectObj = subject(subjectStr, value);

                if (!req.permissions.can(action, subjectObj)) {
                    req.passed = false;
                    return null;
                }

                // In GQL contexts, fields were determined pre-resolver. In other contexts, we can only determine them
                //  post-resolver, which is done here.
                if (context.getType<GqlContextType>() !== "graphql") {
                    Object.keys(value).forEach((v) => fields.add(v));

                    // Remove any specifically excluded fields from the list of fields.
                    if (rule.options?.excludeFields) {
                        rule.options.excludeFields.forEach((v) => fields.delete(v));
                    }
                }

                // Test the ability against each requested field with subject value.
                for (const field of fields) {
                    if (!req.permissions.can(action, subjectObj, field)) {
                        req.passed = false;
                        return null;
                    }
                }

                req.passed = true;
                return value;
            })
        );
    }

    /**
     * Test that the current user has permission to perform the given {@link Rule} within their {@link GlimpseAbility},
     *  and then call and return the passed handler's value if so. Permissions are also tested against the specific
     *  values that is returned by the handler, so it is possible for the handler to be called and the request still to
     *  fail if the user didn't have permission to read the specific values in question. For this reason, the
     *  resolvers/handlers which this rule handler is applied to should not have any mutating effects.
     *
     *  In addition to traditional subject/field permission checks, ReadMany rules also allow for the use of sorting,
     *  filtering, and pagination. These permissions are handled as such:
     *
     *  - <b>Sorting:</b> The user must have {@link AbilityAction.Sort} permission on the field being sorted by. The
     *    user's {@link GlimpseAbility} to read the field(s) being sorted is not currently taken into account. As such,
     *    it is possible for a user to infer some information about fields which they cannot read as long as they have
     *    permission to sort by them.
     *  - <b>Filtering:</b> The user must have {@link AbilityAction.Filter} permission on the field being filtered by.
     *    The user's {@link GlimpseAbility} to read the field(s) being filtered is not currently taken into account. As
     *    such, it is possible for a user to infer some information about fields which they cannot read as long as they
     *    have permission to filter by them.
     *  - <b>Pagination:</b> Generally, there are no permission checks against permission necessary. However, if the
     *    user is using cursor-based pagination, they must have permission to sort by the "ID" field. This is because
     *    cursor-based pagination requires sorting by some field by its very nature, and the "ID" field is the only
     *    field which Glimpse currently allows to be used for this. For skip-based pagination, there are no permission
     *    checks.
     *
     *  Currently, sorting and filtering permissions cannot have conditions applied to them. It is expected that any
     *  sorting or filtering permissions that the user has do not have conditions applied. If they do, the conditions
     *  will currently be ignored and the user will be able to sort or filter by the field regardless of the conditions.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @typeParam T - The type of the array of values expected to be returned by the resolver/handler which this rule
     *  is being applied to. E.g., if the resolver returns an array of {@link User| Users}, T would be {@link User}.
     *  Currently, this must be an instance of a valid {@link AbilitySubjects} type.
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not ReadMany, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass, and then additional checks are applied to the
     *  return value.
     * @returns The value returned from the handler, or null if the rule checks fail. If the rule's strict mode is
     *  enabled, then this will return null if the user doesn't have permission to read one or more of the fields on
     *  any object within the array returned by handler. However, if the rule's strict mode is disabled, then those
     *  fields will be set to null on the relevant objects. Note that if the user doesn't have permission to read the
     *  field on <i>any</i> object of the given type, the same behavior as strict mode will occur. That is, null will
     *  be returned and {@link Request#passed} will be set to false. It is only when the user has permission to read the
     *  field on some objects of the given type that the strict mode behavior will differ.
     * @throws Error if the rule type is not {@link RuleType.ReadMany}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleReadManyRule<T extends Exclude<AbilitySubjects, string>>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T[] | null>
    ): Observable<T[] | null> {
        if (rule.type !== RuleType.ReadMany) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleReadManyRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleReadManyRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        // Make sure user has permission to sort by the fields which they are sorting by.
        const sortingFields = this.getSortingFields(context, rule.options?.orderInputName ?? "order");
        for (const field of sortingFields) {
            // Sort actions cannot have conditions, and cannot be applied to subject values.
            // TODO make sure the user has no sort permissions that have conditions
            if (!req.permissions.can(AbilityAction.Sort, subjectStr, field)) {
                req.passed = false;
                return of(null);
            }
        }

        // Make sure user has permission to filter by the fields which they are filtering by.
        const filteringFields = this.getFilteringFields(context, rule.options?.filterInputName ?? "filter");
        for (const field of filteringFields) {
            // Filter actions cannot have conditions, and cannot be applied to subject values.
            // TODO make sure the user has no filter permissions that have conditions
            if (!req.permissions.can(AbilityAction.Filter, subjectStr, field)) {
                req.passed = false;
                return of(null);
            }
        }

        if (
            !this.canPaginate(context, req.permissions, subjectStr, rule.options?.paginationInputName ?? "pagination")
        ) {
            this.logger.debug(
                `User supplied cursor-based pagination argument(s) but doesn't have permission to sort by ID on the 
                subject "${subjectStr}".`
            );
            req.passed = false;
            return of(null);
        }

        const fields: Set<string> = new Set();
        // Field-based tests can only be done pre-resolver for GraphQL requests, since the request includes the
        //  fields to be returned. Non-GraphQL requests don't include this, as all fields are returned.
        if (context.getType<GqlContextType>() === "graphql") {
            const info = this.getGraphQLInfo(context);
            this.getSelectedFields(info).forEach((v) => fields.add(v));

            // Remove any specifically excluded fields from the list of fields.
            if (rule.options?.excludeFields) {
                rule.options.excludeFields.forEach((v) => fields.delete(v));
            }

            // Test the ability against each requested field
            for (const field of fields) {
                if (!req.permissions.can(action, subjectStr, field)) {
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
                    if (!req.permissions.can(action, subjectObj)) {
                        req.passed = false;
                        return null;
                    }

                    // In GQL contexts, fields were determined pre-resolver. In other contexts, we can only determine them
                    //  post-resolver, which is done here.
                    if (context.getType<GqlContextType>() !== "graphql") {
                        Object.keys(value).forEach((v) => fields.add(v));

                        // Remove any specifically excluded fields from the list of fields.
                        if (rule.options?.excludeFields) {
                            rule.options.excludeFields.forEach((v) => fields.delete(v));
                        }
                    }

                    // Test the ability against each requested field with subject value.
                    for (const field of fields) {
                        if (!req.permissions.can(action, subjectObj, field)) {
                            // Strict mode will cause the entire request to fail if any field fails. Otherwise, the field
                            //  will be set to null. The user won't necessarily know (as of now) whether the field is
                            //  actually null, or they just can't read it.
                            if (rule.options?.strict ?? false) {
                                req.passed = false;
                                return null;
                            } else {
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

    /**
     * Test that the current user has permission to perform the given {@link Rule} with type {@link RuleType.Count}
     *  within their {@link GlimpseAbility}, and then call and return the passed handler's value if so. The user must
     *  have permission to read at least one field on the subject type which they're attempting to count. The user must
     *  also have permission to filter by any fields which they're trying to filter their count by.
     *
     *  Currently, filtering permissions cannot have conditions applied to them. It is expected that any filtering
     *  permissions that the user has do not have conditions applied. If they do, the conditions will currently be
     *  ignored and the user will be able to sort or filter by the field regardless of the conditions.
     *
     *  Counting is primarily used for pagination so the interface can show how many pages are remaining.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link handleReadManyRule} for where pagination is used.
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not Count, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass.
     * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
     *  mutate the return value from the next handler.
     * @throws Error if the rule type is not {@link RuleType.Count}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleCountRule(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<number | null>
    ): Observable<number | null> {
        if (rule.type !== RuleType.Count) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleCountRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleCountRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        // Make sure user has permission to filter by the fields which they are filtering by.
        const filteringFields = this.getFilteringFields(context, rule.options?.filterInputName ?? "filter");
        for (const field of filteringFields) {
            // Filter actions cannot have conditions, and cannot be applied to subject values.
            // TODO make sure the user has no filter permissions that have conditions
            if (!req.permissions.can(AbilityAction.Filter, subjectStr, field)) {
                req.passed = false;
                return of(null);
            }
        }

        // No permission checks need to be applied to the returned value (it's just a number), so return it.
        req.passed = true;
        return handler();
    }

    /**
     * Test that the current user has permission to perform the given {@link Rule} with type {@link RuleType.Create}
     *  within their {@link GlimpseAbility}, and then call and return the passed handler's value if so. The user must
     *  have permission to create at least one field on the subject type which they're attempting to create. The user
     *  must also have permission to read the fields which they're attempting to read after creation. If they have
     *  permission to create the object but can't read the requested fields, the creation will be rolled back. The user
     *  must have permission not only to create an object with the fields they've supplied, but also any default
     *  values generated by the database.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not Create, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass.
     * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
     *  mutate the return value from the next handler.
     * @throws Error if the rule type is not {@link RuleType.Create}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleCreateRule<T extends Exclude<AbilitySubjects, string>>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T | null>
    ): Observable<T | null> {
        if (rule.type !== RuleType.Create) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleCreateRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleCreateRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        const inputFields = this.getInputFields(context, rule.options?.inputName ?? "input");

        // Make sure user can create an object with the fields they've supplied.
        for (const field of inputFields) {
            if (!req.permissions.can(action, subjectStr, field)) {
                req.passed = false;
                return of(null);
            }
        }

        // TODO make sure the user will be able to read the fields which they've requested to read.

        return handler().pipe(
            map((newValue) => {
                // Handler already marked the request as failed for some permission error.
                if (req.passed === false) {
                    return null;
                }

                const subjectObj = subject(subjectStr, newValue);

                // Check that the user has permission to create an object like this one. If not, prisma tx will roll back.
                for (const field of Object.keys(newValue)) {
                    if (!req.permissions.can(action, subjectObj, field)) {
                        req.passed = false;
                        return null;
                    }
                }

                req.passed = true;
                return newValue;
            })
        );
    }

    /**
     * Test that the current user has permission to perform the given {@link Rule} with type {@link RuleType.Update}
     *  within their {@link GlimpseAbility}, and then call and return the passed handler's value if so. The user must
     *  have permission to update at least one field on the subject type which they're attempting to update. The user
     *  must also have permission to read the fields which they're attempting to read after the update. If they have
     *  permission to update the object but can't read the requested fields, the update will be rolled back. The user
     *  must have permission not only to update an object with the fields they've supplied, but also any default
     *  values generated by the database.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not Update, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass.
     * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
     *  mutate the return value from the next handler.
     * @throws Error if the rule type is not {@link RuleType.Update}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleUpdateRule<T extends Exclude<AbilitySubjects, string>>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T | null>
    ): Observable<T | null> {
        if (rule.type !== RuleType.Update) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleUpdateRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleUpdateRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        const inputFields = this.getInputFields(context, rule.options?.inputName ?? "input");

        // Make sure user can update an object with the fields they've supplied.
        for (const field of inputFields) {
            if (!req.permissions.can(action, subjectStr, field)) {
                req.passed = false;
                return of(null);
            }
        }

        // FIXME currently there is no way to check within the interceptor if the user has permission to update the
        //  object to update before it's been updated. This check needs to be done in the resolver. This can be solved
        //  in a future refactor.

        // TODO make sure the user will be able to read the fields which they've requested to read.

        return handler().pipe(
            map((newValue) => {
                // Handler already marked the request as failed for some permission error.
                if (req.passed === false) {
                    return null;
                }

                const subjectObj = subject(subjectStr, newValue);

                // Check that the user has permission to update TO an object like this one. If not, prisma tx will roll
                //  back.
                for (const field of inputFields) {
                    if (!req.permissions.can(action, subjectObj, field)) {
                        req.passed = false;
                        return null;
                    }
                }

                req.passed = true;
                return newValue;
            })
        );
    }

    /**
     * Test that the current user has permission to perform the given {@link Rule} with type {@link RuleType.Delete}
     *  within their {@link GlimpseAbility}, and then call and return the passed handler's value if so. The user must
     *  have permission to delete the object that they are trying to delete. Field-based permissions do not
     *  make sense in the context of delete actions, and as a result, are ignored. The user must also have permission to
     *  read the fields which they're attempting to read after the deletion. If they have permission to delete the
     *  object but can't read the requested fields, the deletion will be rolled back.
     *
     *  The current user's permissions are determined by the {@link Request#permissions} property within the current
     *  NestJS execution context. The {@link CaslInterceptor} is expected to have already initialized this value.
     *
     *  If any rule checks fail, then this method sets {@link Request#passed} to false on the context's request object
     *  and returns null, potentially before calling the handler. From there, the {@link CaslInterceptor} will see that
     *  {@link Request#passed} is false and throw an error.
     *
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     *
     * @param context - NestJS execution context.
     * @param rule - Rule to test. If rule type is not Delete, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param handler - The handler that calls the request method/resolver, or the next interceptor in line if
     *  applicable. This is called after the necessary rule checks pass.
     * @returns The value returned from the handler, or null if the rule checks fail. This rule handler does not ever
     *  mutate the return value from the next handler.
     * @throws Error if the rule type is not {@link RuleType.Delete}.
     * @throws Error if the rule definition is a {@link RuleFn}.
     * @throws Error if the current user's permissions are not initialized.
     */
    public handleDeleteRule<T extends Exclude<AbilitySubjects, string>>(
        context: ExecutionContext,
        rule: Rule,
        handler: () => Observable<T | null>
    ): Observable<T | null> {
        if (rule.type !== RuleType.Delete) {
            throw new Error(`Cannot test rule of type "${rule.type}" with handleDeleteRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with handleDeleteRule.");
        }

        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        // Basic test with the provided action and subject.
        if (!req.permissions.can(action, subjectStr)) {
            req.passed = false;
            return of(null);
        }

        // TODO make sure the user will be able to read the fields which they've requested to read.

        // FIXME currently there is no way to check within the interceptor if the user has permission to delete the
        //  object to delete before it's been deleted. This check needs to be done in the resolver. This can be solved
        //  in a future refactor. Technically not required, but it would improve efficiency.

        return handler().pipe(
            map((newValue) => {
                // Handler already marked the request as failed for some permission error.
                if (req.passed === false) {
                    return null;
                }

                // Check the user can actually delete the object. Note, the deletion has already happened within the
                //  transaction at this point. However, if the user doesn't have permission, it'll be rolled back.
                //  The resolver can also do this before executing the deletion query. See the FIX-ME above.
                const subjectObj = subject(subjectStr, newValue);
                if (!req.permissions.can(action, subjectObj)) {
                    req.passed = false;
                    return null;
                }

                req.passed = true;
                return newValue;
            })
        );
    }
}
