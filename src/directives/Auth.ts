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
 * Check the directives for arguments to a field resolver for @Auth directives, and check that the user has permission
 *   to use them. This is mostly used for create/update requests.
 *
 *   This checks that the given CASL ability grants
 *   permission to the PASSED value(s), and not what the values currently are. E.g., if updating a user's name from
 *   "Billy" to "Bob", this allows you to check that the ability grants permission to edit users with the name "Bob",
 *   but it doesn't check that it grants permission to edit users named "Billy". This needs to be done in the individual
 *   update resolvers, but isn't necessary for create resolvers, since there is no original object.
 *
 *   Unlike fields, arguments do not require @Auth directives. It does not make sense to apply these directives to
 *   arguments which are not used for writing to the database. If an input is purely used for reading/selection, then
 *   permissions for this are handled already by {@link authDirective}. For this reason, the absence of an @Auth
 *   directive is interpreted as anyone can use the given argument regardless of its value(s), so care needs to be
 *   taken to add the @Auth directive to arguments which require it.
 * @param fieldConfig Field definition configuration of the field which we want to search the arguments of.
 * @param args Object containing the passed argument values into the resolver.
 * @param ability CASL ability to check the permissions of.
 * @param directiveDef Definition of the directive to search for, returned from schema.getDirective()
 * @param directiveName Name of the directive to search for. Probably "Auth".
 */
function checkArgsDirectives(fieldConfig: GraphQLFieldConfig<any, any>, args: { [p: string]: any }, ability: GlimpseAbility, directiveDef: GraphQLDirective, directiveName: string): void {
    if(fieldConfig.astNode && fieldConfig.astNode.arguments && fieldConfig.astNode.arguments.length > 0) {
        for(const arg of fieldConfig.astNode.arguments) {
            // Don't bother with arguments which don't have directives. Assume they are public.
            if(!arg.directives || arg.directives.length === 0) {
                continue;
            }

            const argValue = args[arg.name.value];
            // Must add hasOwnProperty method https://github.com/stalniy/casl/issues/604
            argValue.hasOwnProperty = Object.prototype.hasOwnProperty.bind(argValue);

            // Each argument can have multiple @Auth directives applied to it.
            for(const directive of arg.directives) {
                // Skip non-"@Auth" directives
                if(directive.name.value !== directiveName) {
                    continue;
                }
                // Action and subject values passed to the directive
                const { action, subject: subjectVal } = getArgumentValues(directiveDef, directive);
                // We now have everything we need to check permissions.
                if(typeof argValue === "object" && !Array.isArray(argValue)) {
                    // If this argument is an object, check that the user has permission to use
                    //   each of the fields on the object.
                    for(const argProp in argValue) {
                        if(!ability.can(action, subject(subjectVal, argValue), argProp)) {
                            throw new GraphQLYogaError('Insufficient permissions');
                        }
                    }
                } else {
                    // Otherwise, if argument isn't an object, just check that they have permission
                    //   for the given directive, no fields check.
                    if(!ability.can(action, subject(subjectVal, argValue))) {
                        throw new GraphQLYogaError('Insufficient permissions');
                    }
                }
            }
        }
    }
}

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
                        // Check the directives applied to each argument, if there are any.
                        checkArgsDirectives(fieldConfig, args, ctx.permissions, authDirectiveDef, directiveName);

                        // If arguments have passed at this point, then we can check the query itself now.
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
