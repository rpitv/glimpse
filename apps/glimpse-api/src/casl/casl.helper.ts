import {
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    Logger
} from "@nestjs/common";
import { Rule, RuleType } from "./rules.decorator";
import { AbilitySubjects, GlimpseAbility } from "./casl-ability.factory";
import { subject } from "@casl/ability";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql/type";
import { Kind } from "graphql/language";

@Injectable()
export class CaslHelper {
    private readonly logger: Logger = new Logger("CaslHelper");

    /**
     * Get the fields which the user is selecting from the GraphQL query info object. Resolvers will typically return
     *  the entire object, but the user may only be interested in a subset of the fields, which the GraphQL driver
     *  filters out.
     *  TODO basic field selection is supported, but inline fragments and fragment spreads are not.
     * @param info GraphQL query info object.
     * @returns Set of field names which the user is selecting.
     */
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
    private getSubjectAsString(
        subj: AbilitySubjects
    ): Extract<AbilitySubjects, string> {
        // Since Glimpse stores all subjects as strings within the DB, we must convert the ability subject
        //  to a string before testing. Typeof classes === function.
        if (typeof subj === "string") {
            return subj;
        } else if (typeof subj === "function") {
            return (subj.modelName || subj.name) as Extract<
                AbilitySubjects,
                string
            >;
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
    public testCustomRule(
        context: ExecutionContext,
        rule: Rule,
        ability: GlimpseAbility,
        value?: any
    ): boolean {
        if (rule.type !== RuleType.Custom) {
            throw new Error(
                `Cannot test rule of type "${rule.type}" with testCustomRule.`
            );
        }
        if (typeof rule.rule !== "function") {
            throw new Error(
                "Cannot test rule with a tuple with testCustomRule."
            );
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
    public testReadOneRule(
        context: ExecutionContext,
        rule: Rule,
        ability: GlimpseAbility,
        value?: any
    ): boolean {
        if (rule.type !== RuleType.ReadOne) {
            throw new Error(
                `Cannot test rule of type "${rule.type}" with testReadOneRule.`
            );
        }
        if (typeof rule.rule === "function") {
            throw new Error(
                "Cannot test rule with a RuleFn with testReadOneRule."
            );
        }

        const [action, subjectSrc] = rule.rule;
        const subjectStr = this.getSubjectAsString(subjectSrc);
        const subj =
            value !== undefined ? subject(subjectStr, value) : subjectStr;

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

        // Remove any specifically excluded fields from the list of inferred fields.
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
     * @private
     */
    public testReadManyRule(
        context: ExecutionContext,
        rule: Rule,
        ability: GlimpseAbility,
        value?: any[] | null
    ): boolean {
        if (rule.type !== RuleType.ReadMany) {
            throw new Error(
                `Cannot test rule of type "${rule.type}" with testReadManyRule.`
            );
        }
        if (typeof rule.rule === "function") {
            throw new Error(
                "Cannot test rule with a RuleFn with testReadManyRule."
            );
        }

        // Assert that value is an array or null. If it's null or an empty array, then there are no values
        //  to check, so the rule passes. Type-based checks only occur when value is undefined.
        if (value !== undefined) {
            if (!Array.isArray(value) && value !== null) {
                throw new Error(
                    "Value must be an array or null when not undefined."
                );
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

        // TODO ordering permission checks
        // TODO filtering permission checks

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

        // Remove any specifically excluded fields from the list of inferred fields.
        if (rule.options?.excludeFields) {
            rule.options.excludeFields.forEach((v) => fields.delete(v));
        }

        // Skip field-based tests if no fields are to be tested.
        if (fields.size === 0) {
            return true;
        }

        if (value) {
            // Test the ability against each value.
            for (const v of value) {
                // Test the ability against each requested field on value
                for (const field of fields) {
                    if (!ability.can(action, subject(subjectStr, v), field)) {
                        return false;
                    }
                }
            }
        } else {
            // Test the ability against each requested field on type
            for (const field of fields) {
                if (!ability.can(action, subjectStr, field)) {
                    return false;
                }
            }
        }

        return true;
    }
}
