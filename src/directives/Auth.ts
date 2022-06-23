import {
    defaultFieldResolver,
    GraphQLDirective,
    GraphQLFieldConfig,
    GraphQLSchema
} from "graphql";
import {getArgumentValues, getDirective, MapperKind, mapSchema} from "@graphql-tools/utils";
import {GlimpseAbility, GraphQLContext} from "custom";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {subject} from "@casl/ability";

/**
 * Attach handlers to each resolver which has the @Auth directive. Multiple @Auth directives may be applied to one
 *   resolver/field. This also takes care of handling the directives on arguments.
 */
export function authDirective(directiveName: string): (schema: GraphQLSchema) => GraphQLSchema {
    return (schema: GraphQLSchema): GraphQLSchema => {
        return mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                // Directive value is an array of directives with the name "Auth" on this field.
                const authDirectives = getDirective(schema, fieldConfig, directiveName)
                // GraphQL fields which don't have an Auth directive are presumed to be a mistake.
                //   A developer should fix it by adding a directive and then adding the permission to guests.
                if (!authDirectives || authDirectives.length === 0) {
                    throw new Error('Misconfigured GraphQL field does not have authorization directive(s). Field config: ' +
                        JSON.stringify(fieldConfig))
                }

                // Get the Auth directive definition from the schema. Used for argument directive searching.
                //   As an added benefit, also asserts that the Auth directive is defined, which is required.
                const authDirectiveDef = schema.getDirective(directiveName);
                if(!authDirectiveDef) {
                    throw new Error("Missing required Auth directive");
                }

                // For each directive...
                for (const directive of authDirectives) {
                    // Get the action & subject from the directive. Both are required.
                    const {action, subject: subjectVal} = directive
                    if (!action || !subjectVal) {
                        throw new Error('Missing action and/or subject from Auth directive');
                    }

                    // Get the current resolver for this field, or default if it doesn't have one.
                    const {resolve = defaultFieldResolver} = fieldConfig

                    fieldConfig.resolve = function (parent, args, ctx: GraphQLContext, info) {
                        if (typeName === subjectVal) {
                            // If typeName is equal to the subject, then that means this is a resolver for a field on
                            //   the type, and we should check if the user can read this specific field.
                            if (!ctx.permissions.can(action, subject(subjectVal, parent), fieldName)) {
                                throw new GraphQLYogaError("Insufficient permissions");
                            }
                        } else {
                            // Otherwise, it's the resolver for the whole object before fields have been retrieved,
                            //   and we should check if the user has permission to read ANY field on the type.
                            if (!ctx.permissions.can(action, subjectVal)) {
                                throw new GraphQLYogaError("Insufficient permissions");
                            }
                        }

                        return resolve(parent, args, ctx, info);
                    }
                }
                return fieldConfig
            }
        })
    }
}
