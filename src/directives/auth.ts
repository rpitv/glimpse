import {defaultFieldResolver, GraphQLSchema} from "graphql";
import {getDirective, MapperKind, mapSchema} from "@graphql-tools/utils";
import {GraphQLContext} from "custom";
import {GraphQLYogaError} from "@graphql-yoga/node";

export function authDirective(): (schema: GraphQLSchema) => GraphQLSchema {
    return (schema: GraphQLSchema): GraphQLSchema => {
        return mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                // Get the directive value
                const authDirectives = getDirective(schema, fieldConfig, 'auth')
                // GraphQL fields which don't have an auth directive are presumed to be a mistake.
                //   A developer should fix it by adding a directive and then adding the permission to guests.
                if (!authDirectives || authDirectives.length === 0) {
                    throw new Error('Misconfigured GraphQL field does not have authorization directive(s). Field config: ' +
                        JSON.stringify(fieldConfig))
                }
                // For each directive...
                for (const directive of authDirectives) {
                    // Get the action & subject from the directive. Both are required.
                    const {action, subject} = directive
                    if (!action || !subject) {
                        throw new Error('Missing action and/or subject from auth directive');
                    }

                    // Get the resolver for this field
                    const {resolve = defaultFieldResolver} = fieldConfig
                    // Replace the resolver function, wrapping it with a permission check.
                    fieldConfig.resolve = function (parent, args, ctx: GraphQLContext, info) {
                        if (!ctx.permissions.can(action, subject)) {
                            return new GraphQLYogaError('Insufficient permissions')
                        }
                        // Call original resolver, or next directive if another directive has already been applied.
                        return resolve(parent, args, ctx, info)
                    }
                }
                return fieldConfig
            }
        })
    }
}
