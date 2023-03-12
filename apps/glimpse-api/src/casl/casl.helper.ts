import {
    BadRequestException,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    Logger
} from "@nestjs/common";
import { getRuleHandlerForRuleType, RuleDef, RuleHandler, RuleType } from "./rule.decorator";
import { AbilityAction, AbilitySubjects, AbilitySubjectsMap, GlimpseAbility } from "./casl-ability.factory";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLList, GraphQLResolveInfo, GraphQLType } from "graphql/type";
import { EnumValueNode, IntValueNode, Kind, SelectionNode, visit } from "graphql/language";
import PaginationInput from "../gql/pagination.input";
import { Request } from "express";
import { GraphQLResolverArgs } from "../gql/graphql-resolver-args.class";
import { GraphQLNonNull } from "graphql";

@Injectable()
export class CaslHelper {
    /**
     * Keywords which are used to filter the results of a query. These keywords cannot be properties of
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

    public readonly handlerToRuleTypeMap = new Map<RuleHandler, RuleType>();

    private readonly logger: Logger = new Logger("CaslHelper");

    constructor() {
        for (const ruleType of Object.values(RuleType)) {
            this.handlerToRuleTypeMap.set(getRuleHandlerForRuleType(ruleType), ruleType);
        }
    }

    /**
     * Format a Rule's name into a string that can be used to identify it in logs. If a name was not provided in the
     *  rule's config, it is inferred from the rule's type and subject. If a name was provided but is null or an empty
     *  string, "Unnamed rule" is returned. Otherwise, whatever value is provided in the config is used.
     * @param rule Rule to format the name of.
     * @returns Formatted name of the rule in the form "Rule "name"". If the rule is unnamed, then "Unnamed rule" is
     *  returned.
     */
    public formatRuleName(rule: RuleDef): string {
        // FIXME

        const setName = rule.options?.name;
        // If a name wasn't provided in the rule config, the name can be inferred from the rule's type and subject.
        if (setName === undefined) {
            const ruleType = this.handlerToRuleTypeMap.get(rule.fn);
            const ruleTypeStr = ruleType ?? "<Custom Rule>";

            let subj;
            if (typeof rule.subject === "string") {
                subj = rule.subject;
            } else if (typeof rule.subject === "function") {
                subj = rule.subject.modelName;
            } else if (rule.subject === null) {
                subj = "<null subject>";
            } else {
                subj = rule.subject.constructor.name;
            }

            return `Rule "${ruleTypeStr} ${subj}"`;
        }
        // If a name was explicitly set but is null or an empty string (or can't be inferred), use "Unnamed rule".
        //  Otherwise, return the name.
        return setName ? `Rule "${setName}"` : "Unknown rule";
    }

    /**
     * Retrieve the {@link Express.Request} object from the given execution context. Currently only supports GraphQL and
     *  HTTP execution contexts. If the execution context is set to something else, this will throw an Error.
     * @param context Execution context to retrieve the Request object from.
     * @throws Error if execution context type is not GraphQL or HTTP.
     */
    public getRequest(context: ExecutionContext | GraphQLResolverArgs): Request {
        if (context instanceof GraphQLResolverArgs) {
            return context.context.req;
        }

        if (context.getType<GqlContextType>() === "graphql") {
            this.logger.debug("Request currently in GraphQL context.");
            const gqlContext = GqlExecutionContext.create(context);
            return gqlContext.getContext().req;
        } else if (context.getType() === "http") {
            this.logger.debug("Request currently in HTTP context.");
            return context.switchToHttp().getRequest();
        } else {
            throw new Error(`CASL helper used on unsupported context type ${context.getType()}`);
        }
    }

    /**
     * Recursively get all keys used within an object, including keys used within objects in an array.
     *  This is used to determine which fields are used in a filter.
     *
     * @example
     *  <pre>{ a: 1, b: "two", c: [ { d: 3, e: "four" }, { e: 5, f: "six" } ] }</pre>
     *  will return a Set containing:
     *  <pre>"a", "b", "c", "d", "e", "f"</pre>.
     *
     * @param obj Object to get keys of.
     * @returns Set of keys used in the object.
     */
    public getKeysFromDeepObject(obj: Record<any, any>): Set<string> {
        const keys = new Set<string>();

        if (obj === null || obj === undefined) {
            return keys;
        }

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
        this.logger.debug("Keys from deep object: " + JSON.stringify(keys));
        return keys;
    }

    /**
     * Get the {@link Express.Request} object and a {@link RuleDef}'s subject in string form. These are both frequently
     *  done at the start of a rule handler, so this method is used to reduce code duplication. Subjects have to be
     *  in string form because the Glimpse database stores them as strings.
     * @param context NestJS execution context.
     * @param rule Rule to get the subject of.
     * @returns An object containing the request and subject string.
     * @throws Error if the user permissions are not initialized.
     * @private
     */
    public getReqAndSubject(
        context: ExecutionContext | GraphQLResolverArgs,
        rule: RuleDef
    ): {
        req: Request;
        subjectStr: Extract<AbilitySubjects, string>;
    } {
        const req = this.getRequest(context);
        if (!req.permissions) {
            throw new Error("User permissions not initialized.");
        }

        const subjectStr = this.getSubjectAsString(rule.subject);
        return { req, subjectStr };
    }

    /**
     * Get the field(s) selected within a GraphQL selection node and add them to the provided Set. This is used to
     *  "unwrap" GraphQL fragments and get the fields that are actually being selected, along with their parent type.
     * @param node The selection node to get the fields from.
     * @param fields The Set to add the fields to.
     * @param parentType The name of the parent type of the selected field(s).
     * @todo Fragment spreads are not currently supported.
     * @private
     */
    private addFieldsFromSelectionNode(node: SelectionNode, fields: Set<string>, parentType: string): void {
        this.assertNodeKind(node, [Kind.FIELD, Kind.INLINE_FRAGMENT, Kind.FRAGMENT_SPREAD]);
        if (node.kind === Kind.FIELD) {
            fields.add(parentType + "." + node.name.value);
        } else if (node.kind === Kind.INLINE_FRAGMENT) {
            for (const selection of node.selectionSet.selections) {
                this.addFieldsFromSelectionNode(selection, fields, node.typeCondition.name.value);
            }
        } else if (node.kind === Kind.FRAGMENT_SPREAD) {
            // TODO
            throw new BadRequestException('Unsupported selection Kind "FRAGMENT_SPREAD"');
        }
    }

    /**
     * Get the raw type name from a GraphQL type. GraphQL types can be wrapped in a non-null or list wrapper, so this
     *  method recursively unwraps the type until it gets to the base type, and then returns that type's name.
     * @param type GraphQL type to get the name of.
     * @returns Name of the type, without the non-null or list wrappers/indicators.
     * @private
     */
    private getRawType(type: GraphQLType): string {
        if (type instanceof GraphQLNonNull) {
            return this.getRawType(type.ofType);
        } else if (type instanceof GraphQLList) {
            return this.getRawType(type.ofType);
        } else {
            return type.name;
        }
    }

    /**
     * Get the fields which the user is selecting from the GraphQL query info object. Resolvers will typically return
     *  the entire object, but the user may only be interested in a subset of the fields, which the GraphQL driver
     *  filters out. Each field is prefixed with the parent type name, separated by a period (e.g. "User.id"). This is
     *  useful for union types where the specific type may not already be known before this method is called.
     * @param context NestJS execution context.
     * @returns Set containing the field names which the user is selecting, including the parent type.
     */
    public getSelectedFields(context: ExecutionContext | GraphQLResolverArgs): Set<string> {
        let info;
        if (context instanceof GraphQLResolverArgs) {
            info = context.info;
        } else {
            if (context.getType<GqlContextType>() !== "graphql") {
                throw new Error("Cannot get GraphQL info from non-GraphQL context");
            }
            info = GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>();
        }
        const parentType = this.getRawType(info.returnType);

        const fields = new Set<string>();
        for (const fieldNode of info.fieldNodes) {
            for (const selection of fieldNode.selectionSet?.selections || []) {
                this.addFieldsFromSelectionNode(selection, fields, parentType);
            }
        }
        this.logger.debug(`User requested the following fields in their query: ${JSON.stringify(Array.from(fields))}`);
        return fields;
    }

    /**
     * Check that the user is allowed to filter a query by the given fields, assuming a filter has been supplied.
     * @param context NestJS execution context.
     * @param req Express request object. Should contain the user's permissions on {@link Express.Request#permissions}.
     * @param subjectStr The type of subject which the user is attempting to filter.
     * @param argName Name of the filter parameter in the case of GraphQL queries, or the filter property within the
     *  body for HTTP queries.
     * @todo Filtering currently only supports GraphQL queries.
     * @returns True if the user has permission to filter by all the fields they are filtering by, or false if not.
     */
    public canFilterByFields(
        context: ExecutionContext | GraphQLResolverArgs,
        req: Request,
        subjectStr: Extract<AbilitySubjects, string>,
        argName: string
    ): boolean {
        let contextType;
        if (context instanceof GraphQLResolverArgs) {
            contextType = "graphql";
        } else {
            contextType = context.getType<GqlContextType>();
        }

        this.logger.verbose(`Filtering in ${contextType} context`);
        const filteringFields = new Set<string>();
        if (contextType === "graphql") {
            let info;
            if (context instanceof GraphQLResolverArgs) {
                info = context.info;
            } else {
                info = GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>();
            }

            // Each requested field...
            for (const fieldNode of info.fieldNodes) {
                // Find the argument which is the filter, if present.
                const filterArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (filterArg === undefined) {
                    continue;
                }

                this.assertNodeKind(filterArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                // The filter is an object, i.e. it was passed directly in the query as an AST.
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
                    // The filter is a variable, we can just get the JSON object from the variables.
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
        } else if (contextType === "http") {
            // TODO
            throw new Error("HTTP filtering not yet implemented");
        } else {
            throw new Error("Unsupported execution context");
        }

        this.logger.debug(
            `User attempting to filter using the following fields in their query: ${JSON.stringify(
                Array.from(filteringFields)
            )}`
        );

        for (const field of filteringFields) {
            // Filter actions cannot have conditions, and cannot be applied to subject values.
            // TODO make sure the user has no filter permissions that have conditions
            if (!req.permissions.can(AbilityAction.Filter, subjectStr, field)) {
                this.logger.debug(`User does not have permission to filter by field "${field}"`);
                return false;
            }
        }
        return true;
    }

    /**
     * Check that the user is allowed to sort a query by the given fields, assuming a sort order has been supplied.
     * @param context NestJS execution context.
     * @param req Express request object. Should contain the user's permissions on {@link Express.Request#permissions}.
     * @param subjectStr The type of subject which the user is attempting to sort.
     * @param argName Name of the sort parameter in the case of GraphQL queries, or the sort property within the body
     *  for HTTP queries.
     * @todo Sorting currently only supports GraphQL queries.
     * @returns True if the user has permission to sort by all the fields they are sorting by, or false if not.
     */
    public canSortByFields(
        context: ExecutionContext | GraphQLResolverArgs,
        req: Request,
        subjectStr: Extract<AbilitySubjects, string>,
        argName: string
    ): boolean {
        let contextType;
        if (context instanceof GraphQLResolverArgs) {
            contextType = "graphql";
        } else {
            contextType = context.getType<GqlContextType>();
        }
        this.logger.verbose(`Sorting in ${contextType} context`);
        const sortingFields = new Set<string>();
        if (contextType === "graphql") {
            let info;
            if (context instanceof GraphQLResolverArgs) {
                info = context.info;
            } else {
                info = GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>();
            }
            for (const fieldNode of info.fieldNodes) {
                const sortArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (sortArg === undefined) {
                    continue;
                }

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
        } else if (contextType === "http") {
            // TODO
            throw new Error("Sorting via HTTP is not yet supported.");
        } else {
            throw new Error("Unsupported execution context");
        }

        this.logger.debug(
            `User attempting to sort using the following fields in their query: ${JSON.stringify(
                Array.from(sortingFields)
            )}`
        );

        for (const field of sortingFields) {
            // Sort actions cannot have conditions, and cannot be applied to subject values.
            // TODO make sure the user has no sort permissions that have conditions
            if (!req.permissions.can(AbilityAction.Sort, subjectStr, field)) {
                this.logger.debug(`User does not have permission to sort by field "${field}"`);
                return false;
            }
        }
        return true;
    }

    /**
     * Check that the user has permission to paginate the supplied subject type. We need this because cursor-based
     *  pagination requires sorting by ID, and therefore to use it, the user needs to have permission to sort by ID.
     * @param context NestJS execution context.
     * @param ability GlimpseAbility instance.
     * @param subjectName Name of the subject to check permissions for.
     * @param argName Name of the pagination argument in the GraphQL query.
     * @todo Pagination currently only supports GraphQL queries.
     * @returns True if the user has permission to use the supplied pagination argument, false otherwise.
     */
    public canPaginate(
        context: ExecutionContext | GraphQLResolverArgs,
        ability: GlimpseAbility,
        subjectName: Extract<AbilitySubjects, string>,
        argName: string
    ): boolean {
        let contextType;
        if (context instanceof GraphQLResolverArgs) {
            contextType = "graphql";
        } else {
            contextType = context.getType<GqlContextType>();
        }
        this.logger.verbose(`Paginating in ${contextType} context`);
        if (contextType === "graphql") {
            let info;
            if (context instanceof GraphQLResolverArgs) {
                info = context.info;
            } else {
                info = GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>();
            }

            for (const fieldNode of info.fieldNodes) {
                const paginationArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (paginationArg === undefined || paginationArg === null) {
                    continue;
                }

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
                    if (!info.variableValues[argName]) {
                        return true;
                    }
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
     * Get the fields supplied in a Create/Update mutation. These fields are then used to make sure the user has
     *  permission to create/update an object based on those fields.
     * @param context NestJS execution context.
     * @param argName Name of the input data argument in the GraphQL query.
     * @todo Inputting data currently only supports GraphQL queries.
     * @returns Set of field names supplied in the input data.
     */
    public getInputFields(context: ExecutionContext | GraphQLResolverArgs, argName: string): Set<string> {
        let contextType;
        if (context instanceof GraphQLResolverArgs) {
            contextType = "graphql";
        } else {
            contextType = context.getType<GqlContextType>();
        }
        this.logger.verbose(`Retrieving input fields in ${contextType} context`);
        if (contextType === "graphql") {
            let info;
            if (context instanceof GraphQLResolverArgs) {
                info = context.info;
            } else {
                info = GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>();
            }

            const inputFields = new Set<string>();
            for (const fieldNode of info.fieldNodes) {
                const inputArg = fieldNode.arguments.find((arg) => arg.name.value === argName);
                if (inputArg === undefined) {
                    continue;
                }

                this.assertNodeKind(inputArg.value, [Kind.OBJECT, Kind.VARIABLE]);

                if (inputArg.value.kind === Kind.OBJECT) {
                    this.logger.verbose("Input argument passed in as AST.");
                    const inputAst = inputArg.value;
                    visit(inputAst, {
                        ObjectField: {
                            enter: (node) => {
                                inputFields.add(node.name.value);
                            }
                        }
                    });
                } else {
                    this.logger.verbose("Input argument passed in as variable.");
                    const argName = inputArg.name.value;
                    for (const fieldName of Object.keys(info.variableValues[argName])) {
                        inputFields.add(fieldName);
                    }
                }
            }
            this.logger.debug(
                `User input the following fields in their mutation: ${JSON.stringify(Array.from(inputFields))}`
            );
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
     *  feature of GraphQL. This method does not need to be used when TypeScript already guarantees
     *  that the node is of the expected type.
     * @param node GraphQL node to check.
     * @param expectedKind Expected kind of the node. Can also be an array of Kinds, in which case
     *  the node must be one of the expected kinds.
     * @throws Error if the node is not of the expected kind.
     * @private
     */
    private assertNodeKind(node: { kind: Kind } | undefined, expectedKind: Kind | Kind[]): void {
        if (Array.isArray(expectedKind)) {
            this.logger.verbose(`Asserting that node kind "${node?.kind}" is one of "${expectedKind.join('", "')}".`);
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
            this.logger.verbose(`Asserting that node kind "${node?.kind}" is "${expectedKind}".`);
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
     * Convert an {@link AbilitySubjects} value into a string. Glimpse stores all subjects as strings within the
     *  database, so we must convert non-string {@link AbilitySubjects} values into strings before passing them to CASL.
     *  This is accomplished by returning the static "modelName" property on classes if it exists, or the
     *  class/constructor name otherwise.
     * @param subj Subject to convert. May be null.
     * @returns String representation of the subject type. If the subject is null, null is returned.
     */
    public getSubjectAsString(subj: AbilitySubjects): Extract<AbilitySubjects, string> | null {
        if (subj === null) {
            return null;
        }

        // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
        //  to a string before testing. Typeof classes === function.
        if (typeof subj === "string") {
            this.logger.verbose("Getting subject as string but subject is already a string: " + subj);
            return subj;
        } else if (typeof subj === "function") {
            this.logger.verbose("Getting subject as a string from a class.");
            const subjStr = (subj.modelName || subj.name) as Extract<AbilitySubjects, string>;
            this.logger.verbose("Subject string: " + subjStr);
            return subjStr;
        } else if (subj?.constructor?.name && AbilitySubjectsMap[subj.constructor.name] !== undefined) {
            this.logger.verbose("Getting subject as a string from an instance of a class.");
            const subjStr = subj.constructor.name as Extract<AbilitySubjects, string>;
            this.logger.verbose("Subject string: " + subjStr);
            return subjStr;
        } else {
            this.logger.verbose(
                "Attempted to get subject from a string but subject is not a string or class. Type: " + typeof subj
            );
            throw new Error("Unknown subject type");
        }
    }
}
