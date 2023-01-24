import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NestInterceptor
} from "@nestjs/common";
import { firstValueFrom, Observable } from "rxjs";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import {
    AbilitySubjects,
    CaslAbilityFactory,
    GlimpseAbility
} from "./casl-ability.factory";
import { Rule, RuleDef, RULES_METADATA_KEY } from "./rules.decorator";
import { Reflector } from "@nestjs/core";
import { subject } from "@casl/ability";
import { Request } from "express";
import { GraphQLResolveInfo } from "graphql/type";
import { Kind } from "graphql/language";

/*
General CRUD steps:

Read one:
- Check the user has permission to read at least one field on objects of the given type
- Check the user has permission to read all the requested fields on the given type
- Get object
- Check user has permission to read at least one field on this specific object
- Check the user has permission to read all the requested fields on this specific object

Read many:
- Check the user has permission to read at least one field on objects of the given type
- Check the user has permission to read all the requested fields on the given type
- Check the user has permission to read the filtering fields
- Check the user has permission to read objects with the filter values
- Check the user has permission to read the ordering fields, unconditionally*
- Get objects
- Check user has permission to read at least one field on each object
- Check the user has permission to read all the requested fields on each object
- Check the user has permission to read the filtered value on each object
- Check the user has permission to read the ordering value on each object

    *NOTE: Ordering does introduce a slight security hole when used in combination with pagination. Imagine you have
    three documents:
    - {"name": "Document 1", "secret": 7, "public": true}
    - {"name": "Document 2", "secret": 8, "public": false}
    - {"name": "Document 3", "secret": 9, "public": true}
    The user has permission to read "name" on all documents, but only "secret" on documents which are public. If the
    user requests the field "name" and orders "secret" in descending order, this would normally throw a Forbidden error.
    However, if the user uses pagination to request only one document at a time, they would only get a Forbidden error
    on the second page (i.e., when requesting Document 2). From this, they can infer that Document 2 must have a secret
    value between 7 and 9. If secret values are unique integers, then they are able to conclusively infer that
    Document 2 has a secret value of 8. To solve this issue, the user is not allowed to order by fields which they
    have any conditional permissions against.

Update:
- Check the user has permission to update at least one field on objects of the given type
- Check the user has permission to update all the supplied fields on objects of the given type
- Get the object to be updated
- Check the user has permission to update at least one field on the object
- Check the user has permission to update all the fields on the object
- Tentatively update the object via a transaction
- Check the user has permission to update at least one field on the object
- Check the user has permission to update all the fields on the object
- Save the transaction, or rollback if either of the previous two checks failed.

Create:
- Check the user has permission to create at least one field on objects of the given type
- Check the user has permission to create all the supplied fields on objects of the given type
- Tentatively create the object via a transaction
- Check the user has permission to create at least one field on the object
- Check the user has permission to create all the fields on the object, including defaults
- Save the transaction, or rollback if either of the previous two checks failed.

Delete:
- Check the user has permission to delete objects of the given type*
- Get the object to be deleted
- Check the user has permission to delete the object
- Delete the object

    *NOTE: Field-based permissions do not make sense in the context of record deletion. There should be constraints
    (either in code or the database itself) to specifically prevent field restrictions from being set on delete rules.

 */

@Injectable()
export class CaslInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("CaslInterceptor");

    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory
    ) {}

    private formatRuleName(rule: Rule): string {
        return `Rule "${rule.name}"` || "Unnamed rule";
    }

    private testRulesWithoutValue(
        context: ExecutionContext,
        rules: Rule[],
        ability: GlimpseAbility
    ): void {
        if (!rules || rules.length === 0) {
            this.logger.verbose(
                "No rules applied for the given resource. Pass."
            );
            return;
        }

        for (const rule of rules) {
            const ruleNameStr = this.formatRuleName(rule);
            this.logger.verbose(`Testing ${ruleNameStr} without value.`);
            // RuleFn
            if (typeof rule.rule === "function") {
                if (!rule.rule(ability, context)) {
                    this.logger.debug(
                        `${ruleNameStr} function returned false. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            }

            // [AbilityAction, AbilitySubjects, string]
            else if (Array.isArray(rule.rule)) {
                // https://stackoverflow.com/a/53832911/4698546
                let [, subj] = <RuleDef>rule.rule;
                const [action, , field] = <RuleDef>rule.rule;

                // If this is an array, extract the type from the array. Arrays as subjects are used to indicate
                //  that the return type is an array when checkValues option is passed as true.
                if (Array.isArray(subj)) {
                    subj = subj[0];
                }

                // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
                //  to a string before testing. Typeof classes === function.
                if (typeof subj === "function") {
                    subj = <Extract<AbilitySubjects, string>>(
                        (subj.modelName || subj.name)
                    );
                }

                // For field checks, a subject is required.
                if (subj && (field || rule.options?.inferFields === true)) {
                    throw new Error(
                        "Fields cannot be checked or inferred without a subject type."
                    );
                }

                // The @Rule() decorator supports two ways of checking fields, which probably aren't ever intended to be
                //  used in combination with each other, however there is no reason they can't be. Warn when this happens.
                if (
                    field !== undefined &&
                    rule.options?.inferFields === true &&
                    rule.options?.muteFieldsWarning !== false
                ) {
                    this.logger.warn(
                        `Field is passed to @Rule decorator in ${ruleNameStr}, but inferFields ` +
                            `option was explicitly set to true. Both the explicit field and inferred fields will be ` +
                            `checked. If this is desired, set the "muteFieldsWarning" option to true.`
                    );
                }

                // Basic test with the provided action and optional subject + field.
                if (!ability.can(action, subj, field)) {
                    this.logger.debug(
                        `${ruleNameStr} condition failed. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }

                // Fields should be inferred if a field was not passed and the inferFields option was not explicitly
                //  set to false, or if the inferFields object was explicitly set to true.
                const shouldInferFields =
                    rule.options?.inferFields === true ||
                    (!field && rule.options?.inferFields !== false);
                // Fields cannot be inferred without a value outside of GraphQL requests.
                if (
                    shouldInferFields &&
                    context.getType<GqlContextType>() === "graphql"
                ) {
                    // Get the info from the GQL request, so we can see what fields are requested from the returned object.
                    //  If this is not a GraphQL request, info will be null, and each property on the returned value
                    //  should be checked instead.
                    const info = this.getGraphQLInfo(context);
                    const fields = this.getSelectedFields(info);

                    // Remove any specifically excluded fields from the list of inferred fields.
                    if (rule.options?.excludeFields) {
                        rule.options.excludeFields.forEach((v) =>
                            fields.delete(v)
                        );
                    }

                    // Test the ability against each inferred field
                    for (const inferredField of fields) {
                        if (!ability.can(action, subj, inferredField)) {
                            this.logger.debug(
                                `${ruleNameStr} condition failed with inferred field "${inferredField}". Throwing ForbiddenException.`
                            );
                            throw new ForbiddenException();
                        }
                    }
                }
            } else {
                throw new Error("Unknown Rule definition");
            }
        }
    }

    private testRulesWithValue(
        context: ExecutionContext,
        rules: Rule[],
        ability: GlimpseAbility,
        value: any
    ): void {
        if (!rules || rules.length === 0) {
            this.logger.verbose(
                "No rules applied for the given resource. Pass."
            );
            return;
        }

        for (const rule of rules) {
            const ruleNameStr = this.formatRuleName(rule);
            this.logger.verbose(`Testing ${ruleNameStr} with value.`);

            if (!(rule.options?.checkValue ?? true)) {
                this.logger.verbose(
                    `Rule ${ruleNameStr} checkValue option is set to false. Skipping.`
                );
                continue;
            }

            // RuleFn
            if (typeof rule.rule === "function") {
                if (!rule.rule(ability, context, value)) {
                    this.logger.debug(
                        `${ruleNameStr} function with value returned false. Throwing ForbiddenException.`
                    );
                    throw new ForbiddenException();
                }
            }

            // [AbilityAction, AbilitySubjects, string]
            else if (Array.isArray(rule.rule)) {
                // https://stackoverflow.com/a/53832911/4698546
                let [, subj] = <RuleDef>rule.rule;
                const [action, , field] = <RuleDef>rule.rule;

                // If this is an array, extract the type from the array. Arrays as subjects are used to indicate
                //  that the return type is an array when checkValues option is passed as true.
                let subjIsArray;
                if ((subjIsArray = Array.isArray(subj))) {
                    subj = subj[0];
                }
                if (subjIsArray && !Array.isArray(value)) {
                    throw new Error(
                        `Expected subject value to be an array but received ${typeof value}`
                    );
                }

                // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
                //  to a string before testing. Typeof classes === function.
                if (typeof subj === "function") {
                    subj = <Extract<AbilitySubjects, string>>(
                        (subj.modelName || subj.name)
                    );
                }

                // For field checks, a subject is required.
                if (subj && (field || rule.options?.inferFields === true)) {
                    throw new Error(
                        "Fields cannot be checked or inferred without a subject type."
                    );
                }

                // The @Rule() decorator supports two ways of checking fields, which probably aren't ever intended to be
                //  used in combination with each other, however there is no reason they can't be. Warn when this happens.
                if (
                    field !== undefined &&
                    rule.options?.inferFields === true &&
                    rule.options?.muteFieldsWarning !== false
                ) {
                    this.logger.warn(
                        `Field is passed to @Rule decorator in ${ruleNameStr}, but inferFields ` +
                            `option was explicitly set to true. Both the explicit field and inferred fields will be ` +
                            `checked. If this is desired, set the "muteFieldsWarning" option to true.`
                    );
                }

                // Basic test with the provided action and optional subject + field.
                if (subjIsArray) {
                    for (const valueItem of value) {
                        if (
                            !ability.can(
                                action,
                                subject(
                                    <Extract<AbilitySubjects, string>>subj,
                                    valueItem
                                ),
                                field
                            )
                        ) {
                            this.logger.debug(
                                `${ruleNameStr} condition failed. Throwing ForbiddenException.`
                            );
                            throw new ForbiddenException();
                        }
                    }
                } else {
                    if (
                        !ability.can(
                            action,
                            subject(
                                <Extract<AbilitySubjects, string>>subj,
                                value
                            ),
                            field
                        )
                    ) {
                        this.logger.debug(
                            `${ruleNameStr} condition failed. Throwing ForbiddenException.`
                        );
                        throw new ForbiddenException();
                    }
                }

                // Fields should be inferred if a field was not passed and the inferFields option was not explicitly
                //  set to false, or if the inferFields object was explicitly set to true.
                const shouldInferFields =
                    rule.options?.inferFields === true ||
                    (!field && rule.options?.inferFields !== false);

                if (!shouldInferFields) {
                    return;
                }

                // In a GraphQL context, inferred fields are only the fields which are requested. In other contexts,
                //  inferred fields are all fields within the value.
                if (context.getType<GqlContextType>() === "graphql") {
                    // Get the info from the GQL request, so we can see what fields are requested from the returned object.
                    //  If this is not a GraphQL request, info will be null, and each property on the returned value
                    //  should be checked instead.
                    const info = this.getGraphQLInfo(context);
                    const fields = this.getSelectedFields(info);

                    // Remove any specifically excluded fields from the list of inferred fields.
                    if (rule.options?.excludeFields) {
                        rule.options.excludeFields.forEach((v) =>
                            fields.delete(v)
                        );
                    }

                    // Test the ability against each inferred field
                    for (const inferredField of fields) {
                        // Basic test with the provided action and optional subject + field.
                        if (subjIsArray) {
                            for (const valueItem of value) {
                                if (
                                    !ability.can(
                                        action,
                                        subject(
                                            <Extract<AbilitySubjects, string>>(
                                                subj
                                            ),
                                            valueItem
                                        ),
                                        inferredField
                                    )
                                ) {
                                    this.logger.debug(
                                        `${ruleNameStr} condition failed with inferred field "${inferredField}". Throwing ForbiddenException.`
                                    );
                                    throw new ForbiddenException();
                                }
                            }
                        } else {
                            if (
                                !ability.can(
                                    action,
                                    subject(
                                        <Extract<AbilitySubjects, string>>subj,
                                        value
                                    ),
                                    inferredField
                                )
                            ) {
                                this.logger.debug(
                                    `${ruleNameStr} condition failed with inferred field "${inferredField}". Throwing ForbiddenException.`
                                );
                                throw new ForbiddenException();
                            }
                        }
                    }
                } else {
                    if (subjIsArray) {
                        for (const valueItem of value) {
                            // Fields can't be inferred on non-objects outside of GraphQL context.
                            if (typeof valueItem !== "object") {
                                return;
                            }
                            const fields = new Set(Object.keys(valueItem));

                            // Remove any specifically excluded fields from the list of inferred fields.
                            if (rule.options?.excludeFields) {
                                rule.options.excludeFields.forEach((v) =>
                                    fields.delete(v)
                                );
                            }

                            // Test the ability against each inferred field
                            for (const inferredField of fields) {
                                if (
                                    !ability.can(
                                        action,
                                        subject(
                                            <Extract<AbilitySubjects, string>>(
                                                subj
                                            ),
                                            valueItem
                                        ),
                                        inferredField
                                    )
                                ) {
                                    this.logger.debug(
                                        `${ruleNameStr} condition failed with inferred field "${inferredField}". Throwing ForbiddenException.`
                                    );
                                    throw new ForbiddenException();
                                }
                            }
                        }
                    } else {
                        // Fields can't be inferred on non-objects outside of GraphQL context.
                        if (typeof value !== "object") {
                            return;
                        }
                        const fields = new Set(Object.keys(value));

                        // Remove any specifically excluded fields from the list of inferred fields.
                        if (rule.options?.excludeFields) {
                            rule.options.excludeFields.forEach((v) =>
                                fields.delete(v)
                            );
                        }

                        // Test the ability against each inferred field
                        for (const inferredField of fields) {
                            if (
                                !ability.can(
                                    action,
                                    subject(
                                        <Extract<AbilitySubjects, string>>subj,
                                        value
                                    ),
                                    inferredField
                                )
                            ) {
                                this.logger.debug(
                                    `${ruleNameStr} condition failed with inferred field "${inferredField}". Throwing ForbiddenException.`
                                );
                                throw new ForbiddenException();
                            }
                        }
                    }
                }
            } else {
                throw new Error("Unknown Rule definition");
            }
        }
    }

    /**
     * Retrieve the Express Request object from the current execution context. Currently only supports GraphQL and
     *  HTTP execution contexts. If the execution context is set to something else, this will throw an Error.
     * @param context Execution context to retrieve the Request object from.
     * @throws Error if execution context type is not GraphQL or HTTP.
     */
    getRequest(context: ExecutionContext): Request {
        if (context.getType<GqlContextType>() === "graphql") {
            this.logger.verbose(
                "CASL interceptor currently in GraphQL context."
            );
            const gqlContext = GqlExecutionContext.create(context);
            return gqlContext.getContext().req;
        } else if (context.getType() === "http") {
            this.logger.verbose("CASL interceptor currently in HTTP context.");
            return context.switchToHttp().getRequest();
        } else {
            throw new Error(
                `CASL interceptor applied to unsupported context type ${context.getType()}`
            );
        }
    }

    getGraphQLInfo(context: ExecutionContext): GraphQLResolveInfo {
        if (context.getType<GqlContextType>() !== "graphql") {
            return null;
        }
        const gqlContext = GqlExecutionContext.create(context);
        return gqlContext.getInfo<GraphQLResolveInfo>();
    }

    getSelectedFields(info: GraphQLResolveInfo): Set<string> {
        const fields = new Set<string>();
        for (const fieldNode of info.fieldNodes) {
            if (fieldNode.kind !== Kind.FIELD) {
                // This should never happen.
                this.logger.warn(
                    `Encountered unexpected field node type "${
                        fieldNode?.kind || "undefined"
                    }" when traversing AST. Field node definition: ${fieldNode}`
                );
                throw new InternalServerErrorException("Unexpected node type");
            }
            for (const selection of fieldNode.selectionSet?.selections || []) {
                if (selection.kind === Kind.FIELD) {
                    if (selection.name.kind !== Kind.NAME) {
                        // This should never happen.
                        this.logger.warn(
                            `Encountered unexpected field node selection name type "${
                                selection.name.kind || "undefined"
                            }" when traversing AST. Selection definition: ${selection}`
                        );
                        throw new InternalServerErrorException(
                            "Unexpected node type"
                        );
                    }
                    fields.add(selection.name.value);
                } else if (selection.kind === Kind.INLINE_FRAGMENT) {
                    // TODO
                    throw new Error(
                        'Unsupported selection kind "INLINE_FRAGMENT"'
                    );
                } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
                    // TODO
                    throw new Error(
                        'Unsupported selection kind "FRAGMENT_SPREAD"'
                    );
                } else {
                    // This should never happen.
                    this.logger.warn(
                        `Encountered unexpected field node selection type "${
                            (selection as any)?.kind || "undefined"
                        }" when traversing AST. Selection node definition: ${selection}`
                    );
                    throw new InternalServerErrorException(
                        "Unexpected node type"
                    );
                }
            }
        }
        this.logger.debug(
            `User requested the following fields in their query: ${[
                ...fields
            ].join(", ")}`
        );
        return fields;
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<any>> {
        this.logger.verbose("CASL interceptor activated...");

        // Retrieve the Request object from the context. Currently only HTTP and GraphQL supported.
        const req = this.getRequest(context);

        // Generate the current user's permissions as of this request if they haven't been generated already.
        if (!req.permissions) {
            this.logger.debug(
                "User request does not yet have CASL ability generated. Generating now..."
            );
            req.permissions = await this.caslAbilityFactory.createForUser(
                req.user
            );
        }

        // Retrieve this method's applied rules. TODO: Allow application at the class-level.
        const rules = this.reflector.get<Rule[]>(
            RULES_METADATA_KEY,
            context.getHandler()
        );

        this.testRulesWithoutValue(context, rules, req.permissions);
        const value = await firstValueFrom(next.handle());
        this.logger.verbose("Method completed.");
        // Re-apply rules but with the actual return value passed in.
        // Note that conditional permission checks are limited to actual fields and not computed fields via
        //  @ResolveField(). There is no reasonable way to check these values for permissions.
        this.testRulesWithValue(context, rules, req.permissions, value);
        return value;
    }
}
