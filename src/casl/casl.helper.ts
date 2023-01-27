import {
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    Logger
} from "@nestjs/common";
import { Rule, RuleType } from "./rules.decorator";
import {AbilityAction, AbilitySubjects, GlimpseAbility} from "./casl-ability.factory";
import { subject } from "@casl/ability";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql/type";
import { EnumValueNode, Kind, visit } from "graphql/language";

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
                    return new Set();
                }

                this.assertNodeKind(filterArg, Kind.ARGUMENT);
                this.assertNodeKind(filterArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                if (filterArg.value.kind === Kind.OBJECT) {
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
                    return new Set();
                }

                this.assertNodeKind(sortArg, Kind.ARGUMENT);
                this.assertNodeKind(sortArg.value, [Kind.LIST, Kind.VARIABLE]);

                if (sortArg.value.kind === Kind.LIST) {
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
     *  set within the rule decorator.
     *
     * @param context NestJS execution context.
     * @param rule Rule to test. If rule type is not Custom, or if the rule definition is not a RuleFn, an error will be
     *  thrown.
     * @param ability GlimpseAbility to check the permissions against.
     * @param value Value to check the rule against. If this method is being called pre-resolution, this should be undefined.
     *  For post-resolution calls, the returned value should be passed in.
     * @returns True if the rule passes, or false if it fails.
     * @throws Error if the rule type is not Custom, or if the rule definition is not a RuleFn.
     * @private
     */
    public testCustomRule(context: ExecutionContext, rule: Rule, ability: GlimpseAbility, value?: any): boolean {
        if (rule.type !== RuleType.Custom) {
            throw new Error(`Cannot test rule of type "${rule.type}" with testCustomRule.`);
        }
        if (typeof rule.rule !== "function") {
            throw new Error("Cannot test rule with a tuple with testCustomRule.");
        }

        return rule.rule(ability, context, value);
    }

    /**
     * Test that the given ability has permission to perform the given rule. If value is provided, then this will check
     *  that the ability has permission to perform the rule on the given value. If value is not provided, then this will
     *  check that the ability has permission to perform the rule on any value of the given subject.
     *
     * Specifically, ReadOne resolvers should perform the following steps:
     * - Check the user has permission to read at least one field on objects of the given type
     * - Check the user has permission to read all the requested fields on the given type
     * - Get object
     * - Check user has permission to read at least one field on this specific object
     * - Check the user has permission to read all the requested fields on this specific object
     *
     * @param context NestJS execution context.
     * @param rule Rule to test. If rule type is not ReadOne, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param ability GlimpseAbility to check the permissions against.
     * @param value Value to check the rule against. If this method is being called pre-resolution, this should be undefined.
     *  For post-resolution calls, the returned value should be passed in.
     * @returns True if the rule passes, or false if it fails.
     * @throws Error if the rule type is not ReadOne, or if the rule definition is a RuleFn.
     * @private
     */
    public testReadOneRule(context: ExecutionContext, rule: Rule, ability: GlimpseAbility, value?: any): boolean {
        if (rule.type !== RuleType.ReadOne) {
            throw new Error(`Cannot test rule of type "${rule.type}" with testReadOneRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with testReadOneRule.");
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);
        const subj = value !== undefined ? subject(subjectStr, value) : subjectStr;

        // Basic test with the provided action and subject.
        if (!ability.can(action, subj)) {
            return false;
        }

        const fields: Set<string> = new Set();
        // Field-based tests can only be done pre-value for GraphQL requests, since the request includes the
        //  fields to be returned.
        if (context.getType<GqlContextType>() === "graphql") {
            const info = this.getGraphQLInfo(context);
            this.getSelectedFields(info).forEach((v) => fields.add(v));
        } else if (value !== undefined) {
            // If we're not in a GraphQL request but value is passed, then it's presumed that all the keys on the value
            //  will be returned to the user, and thus all must be tested.
            Object.keys(value).forEach((v) => fields.add(v));
        }

        // Skip field-based tests if no fields are to be tested.
        if (fields.size === 0) {
            return true;
        }

        // Remove any specifically excluded fields from the list of fields.
        if (rule.options?.excludeFields) {
            rule.options.excludeFields.forEach((v) => fields.delete(v));
        }

        // Test the ability against each requested field
        for (const field of fields) {
            if (!ability.can(action, subj, field)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Test that the given ability has permission to perform the given rule. If value is provided, then this will check
     *  that the ability has permission to perform the rule on each value within the given array. If value is not
     *  provided, then this will check that the ability has permission to perform the rule on any value of the given
     *  subject.
     *
     * Specifically, ReadMany resolvers should perform the following steps:
     *  - Check the user has permission to read at least one field on objects of the given type
     *  - Check the user has permission to read all the requested fields on the given type
     *  - Check the user has permission to read the filtering fields
     *  - Check the user has permission to read objects with the filter values
     *  - Check the user has permission to read the ordering fields, unconditionally*
     *  - Get objects
     *  - Check user has permission to read at least one field on each object
     *  - Check the user has permission to read all the requested fields on each object
     *  - Check the user has permission to read the filtered value on each object
     *  - Check the user has permission to read the ordering value on each object
     *
     * *NOTE: Ordering does introduce a slight security hole when used in combination with pagination. Imagine you have
     *  three documents:
     *   - {"name": "Document 1", "secret": 7, "public": true}
     *   - {"name": "Document 2", "secret": 8, "public": false}
     *   - {"name": "Document 3", "secret": 9, "public": true}
     *  The user has permission to read "name" on all documents, but only "secret" on documents which are public. If the
     *  user requests the field "name" and orders "secret" in descending order, this would normally throw a Forbidden error.
     *  However, if the user uses pagination to request only one document at a time, they would only get a Forbidden error
     *  on the second page (i.e., when requesting Document 2). From this, they can infer that Document 2 must have a secret
     *  value between 7 and 9. If secret values are unique integers, then they are able to conclusively infer that
     *  Document 2 has a secret value of 8. To solve this issue, the user is not allowed to order by fields which they
     *  have any conditional permissions against.
     *
     * @param context NestJS execution context.
     * @param rule Rule to test. If rule type is not ReadOne, or if the rule definition is a RuleFn, an error will be
     *  thrown.
     * @param ability GlimpseAbility to check the permissions against.
     * @param value Values to check the rule against. If this method is being called pre-resolution, this should be
     *  undefined. For post-resolution calls, the returned value should be passed in and must be an array or null.
     * @returns True if the rule passes, or false if it fails.
     * @throws Error if the rule type is not ReadOne, or if the rule definition is a RuleFn.
     * @throws Error if value is not null or an array.
     * @throws HttpException if the requests includes sorting but the sorted fields aren't requested.
     * @private
     */
    public testReadManyRule(
        context: ExecutionContext,
        rule: Rule,
        ability: GlimpseAbility,
        value?: any[] | null
    ): boolean {
        if (rule.type !== RuleType.ReadMany) {
            throw new Error(`Cannot test rule of type "${rule.type}" with testReadManyRule.`);
        }
        if (typeof rule.rule === "function") {
            throw new Error("Cannot test rule with a RuleFn with testReadManyRule.");
        }

        // Assert that value is an array or null. If it's null or an empty array, then there are no values
        //  to check, so the rule passes. Type-based checks only occur when value is undefined.
        if (value !== undefined) {
            if (!Array.isArray(value) && value !== null) {
                throw new Error("Value must be an array or null when not undefined.");
            }
            if (value === null || value.length === 0) {
                return true;
            }
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);

        if (value) {
            // Test the ability against each value.
            for (const v of value) {
                if (!ability.can(action, subject(subjectStr, v))) {
                    return false;
                }
            }
        } else {
            // Basic test with the provided action and subject type.
            if (!ability.can(action, subjectStr)) {
                return false;
            }
        }

        // Make sure user has permission to sort by the fields which they are sorting by.
        const sortingFields = this.getSortingFields(context, rule.options?.orderInputName ?? "order");
        for(const field of sortingFields) {
            // Sort actions cannot have conditions, and cannot be applied to subject values.
            if(!ability.can(AbilityAction.Sort, subjectStr, field)) {
                return false;
            }
        }

        // Make sure user has permission to filter by the fields which they are filtering by.
        const filteringFields = this.getFilteringFields(context, rule.options?.filterInputName ?? "filter");
        for(const field of filteringFields) {
            // Filter actions cannot have conditions, and cannot be applied to subject values.
            if(!ability.can(AbilityAction.Filter, subjectStr, field)) {
                return false;
            }
        }

        const selectedFields: Set<string> = new Set();
        // Field-based tests can only be done pre-value for GraphQL requests, since the request includes the
        //  fields to be returned.
        if (context.getType<GqlContextType>() === "graphql") {
            const info = this.getGraphQLInfo(context);
            this.getSelectedFields(info).forEach((v) => selectedFields.add(v));
        } else if (value !== undefined) {
            // If we're not in a GraphQL request but value is passed, then it's presumed that all the keys on the value
            //  will be returned to the user, and thus all must be tested.
            Object.keys(value).forEach((v) => selectedFields.add(v));
        }

        // Remove any specifically excluded fields from the list of fields.
        if (rule.options?.excludeFields) {
            rule.options.excludeFields.forEach((v) => selectedFields.delete(v));
        }

        this.logger.debug(`Fields to test: ${Array.from(selectedFields).join(", ")}`);

        // Skip field-based tests if no fields are to be tested.
        if (selectedFields.size === 0) {
            return true;
        }

        if (value) {
            // Test the ability against each value.
            for (const v of value) {
                // Test the ability against each requested field on value
                for (const field of selectedFields) {
                    if (!ability.can(action, subject(subjectStr, v), field)) {
                        // Strict mode will cause the entire request to fail if any field fails. Otherwise, the field
                        //  will be set to null. The user won't necessarily know (as of now) whether the field is
                        //  actually null, or they just can't read it.
                        if(rule.options?.strict ?? false) {
                            return false;
                        } else {
                            v[field] = null;
                        }
                    }
                }
            }
        } else {
            // Test the ability against each requested field on type
            for (const field of selectedFields) {
                if (!ability.can(action, subjectStr, field)) {
                    return false;
                }
            }
        }

        return true;
    }
}
