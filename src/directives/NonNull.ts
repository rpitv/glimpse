import {defaultFieldResolver, GraphQLSchema} from "graphql";
import {getDirective, MapperKind, mapSchema} from "@graphql-tools/utils";
import {GraphQLContext} from "custom";
import {GraphQLYogaError} from "@graphql-yoga/node";


/**
 * Attach handlers to each input type field which has the @NonNull directive.
 */
export function nonNullDirective(directiveName: string): (schema: GraphQLSchema) => GraphQLSchema {
    return (schema: GraphQLSchema): GraphQLSchema => {
        // Map of types to a map of their fields to booleans, indicating whether that field is non-null.
        // Undefined and false are equivalent.
        const nonNullFields: Record<string, Record<string, boolean>> = {};

        return mapSchema(schema, {
            [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                const isNonNull = (getDirective(schema, fieldConfig, directiveName)?.length ?? 0) > 0;
                if(isNonNull) {
                    // Create type layer in the non-null fields map if it doesn't exist already
                    if(!nonNullFields[typeName]) {
                        nonNullFields[typeName] = {};
                    }

                    nonNullFields[typeName][fieldName] = true;
                }
                return fieldConfig
            },
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const { resolve = defaultFieldResolver } = fieldConfig;

                fieldConfig.resolve = (parent, args, ctx: GraphQLContext, info) => {
                    if(fieldConfig.args !== undefined) {
                        for(const argName in fieldConfig.args) { // For each argument DEFINITION
                            // Match the type to extract it from its array/required flag (e.g. [Type!]! becomes Type)
                            const argType = fieldConfig.args[argName].type.toString().match(/[_A-Za-z]\w*/)?.[0];
                            if(!argType) { // Could maybe happen if the schema is changed after this resolver is applied.
                                throw new Error('Unexpected regex failure when parsing argument type');
                            }

                            // If this type has non-null properties. Scalars stop here, since they don't have props.
                            if(nonNullFields[argType]) {
                                for(const field in args[argName]) { // For each field on the passed argument VALUE
                                    if(nonNullFields[argType][field] && args[argName][field] === null) {
                                        throw new GraphQLYogaError(`Input field '${field}' on '${argType}' cannot be null.`);
                                    }
                                }
                            }
                        }
                    }
                    return resolve(parent, args, ctx, info);
                }
                return fieldConfig
            }
        })
    }
}
