import {
    defaultFieldResolver,
    GraphQLFieldConfig,
    GraphQLSchema,
} from "graphql";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { GraphQLContext } from "custom";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { subject } from "@casl/ability";
import { Permission } from "../permissions";
import { logger } from "../logger";

/**
 * Cache containing all the @Auth directives on fields on GraphQL output types. First key is the name of the type,
 *   second key is the name of the field. In addition to the array of values at [type][field], there is a default
 *   for all fields of a given type at [type]['*']. This should be merged with the array of values at [type][field].
 */
const authedOutputFields: Record<string, Record<string, Permission[]>> = {};
/**
 * Cache containing all the @Auth directives on fields on GraphQL input types. First key is the name of the type,
 *   second key is the name of the field. In addition to the array of values at [type][field], there is a default
 *   for all fields of a given type at [type]['*']. This should be merged with the array of values at [type][field].
 */
const authedInputFields: Record<string, Record<string, Permission[]>> = {};
/**
 * Cache containing all the @Auth directives on fields on GraphQL input arguments. First key is the name of the type,
 *   second key is the name of the field, and third key is the name of the argument.
 */
const authedArguments: Record<
    string,
    Record<string, Record<string, Permission[]>>
> = {};

const listOfScalars: string[] = [];

/**
 * Get the list of @Auth directives that are applied to a given field on a given type. All the returned directives
 *   must be satisfied for the field to be accessible. Otherwise, the user does not have permission.
 * @param typeName Name of the type which should be looked up.
 * @param fieldName Name of the field on the type which should be looked up.
 * @returns List of @Auth directives that are applied to the given field on the given type. This includes the
 *   default @Auth directives which are applied to the type as a whole.
 */
function getAuthDirectivesForOutputField(
    typeName: string,
    fieldName: string
): Permission[] {
    return [
        ...(authedOutputFields[typeName]?.["*"] || []),
        ...(authedOutputFields[typeName]?.[fieldName] || []),
    ];
}

/**
 * Get the list of @Auth directives that are applied to a given field on a given type. All the returned directives
 *   must be satisfied for the field to be usable. Otherwise, the user does not have permission.
 * @param typeName Name of the type which should be looked up.
 * @param fieldName Name of the field on the type which should be looked up.
 * @returns List of @Auth directives that are applied to the given field on the given type. This includes the
 *   default @Auth directives which are applied to the type as a whole.
 */
function getAuthDirectivesForInputField(
    typeName: string,
    fieldName: string
): Permission[] {
    return [
        ...(authedOutputFields[typeName]?.["*"] || []),
        ...(authedOutputFields[typeName]?.[fieldName] || []),
    ];
}

/**
 * Get the list of @Auth directives that are applied to a given argument on a given field on a given type. All the
 *   returned directives must be satisfied for the argument to be usable. Otherwise, the user does not have permission.
 * @param typeName Name of the type which should be looked up.
 * @param fieldName Name of the field on the type which should be looked up.
 * @param argumentName Name of the argument on the field which should be looked up.
 * @returns List of @Auth directives that are applied to the given argument on the given field on the given type.
 */
function getAuthDirectivesForArgument(
    typeName: string,
    fieldName: string,
    argumentName: string
): Permission[] {
    return authedArguments[typeName]?.[fieldName]?.[argumentName] || [];
}

/**
 * Strip modifiers from a given GraphQL type string. For example, "[User!]!" will be stripped to "User".
 * @param type
 */
function getRawType(type: string): string {
    return type.replace(/[!?\[\]]/g, "");
}

/**
 * Read through the schema to search for directives matching the supplied directive name, and then saves matching
 *   directives' values to a cache which is referenced by our modified resolvers in {@link authDirective}.
 * @param directiveName The name of the directive to search for.
 * @param schema The GraphQL schema to search through.
 */
function collectAuthDirectiveDefinitions(
    directiveName: string,
    schema: GraphQLSchema
): void {
    mapSchema(schema, {
        [MapperKind.SCALAR_TYPE]: (type) => {
            listOfScalars.push(type.name);
            return type;
        },
        [MapperKind.ARGUMENT]: (argConfig, fieldName, typeName) => {
            const argName = argConfig.astNode?.name.value;
            if (!argName) {
                throw new Error(
                    `GraphQL Argument AST for ${typeName}:${fieldName} is missing for some reason.`
                );
            }
            const authDirectives = getDirective(
                schema,
                argConfig,
                directiveName
            );
            if (authDirectives) {
                for (const directive of authDirectives) {
                    if (!authedArguments[typeName]) {
                        authedArguments[typeName] = {};
                    }
                    if (!authedArguments[typeName][fieldName]) {
                        authedArguments[typeName][fieldName] = {};
                    }
                    if (!authedArguments[typeName][fieldName][argName]) {
                        authedArguments[typeName][fieldName][argName] = [];
                    }
                    // If a field is provided, then subject is required.
                    if (directive.field && !directive.subject) {
                        throw new Error(
                            "Misconfigured GraphQL field has authorization directive(s) with field but no subject."
                        );
                    }
                    authedArguments[typeName][fieldName][argName].push({
                        action: directive.action,
                        subject: directive.subject || undefined,
                        field: directive.field || undefined,
                    });
                }
            }
            return argConfig;
        },
        [MapperKind.INPUT_OBJECT_TYPE]: (type) => {
            const authDirectives = getDirective(schema, type, directiveName);
            if (authDirectives) {
                for (const directive of authDirectives) {
                    if (!authedInputFields[type.name]) {
                        authedInputFields[type.name] = {};
                    }
                    if (!authedInputFields[type.name]["*"]) {
                        authedInputFields[type.name]["*"] = [];
                    }
                    // If a field is provided, then subject is required.
                    if (directive.field && !directive.subject) {
                        throw new Error(
                            "Misconfigured GraphQL field has authorization directive(s) with field but no subject."
                        );
                    }
                    authedInputFields[type.name]["*"].push({
                        action: directive.action,
                        subject: directive.subject || undefined,
                        field: directive.field || undefined,
                    });
                }
            }

            return type;
        },
        [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
            const authDirectives = getDirective(
                schema,
                fieldConfig,
                directiveName
            );
            if (authDirectives) {
                for (const directive of authDirectives) {
                    if (!authedInputFields[typeName]) {
                        authedInputFields[typeName] = {};
                    }
                    if (!authedInputFields[typeName][fieldName]) {
                        authedInputFields[typeName][fieldName] = [];
                    }
                    // If a field is provided, then subject is required.
                    if (directive.field && !directive.subject) {
                        throw new Error(
                            "Misconfigured GraphQL field has authorization directive(s) with field but no subject."
                        );
                    }
                    authedInputFields[typeName][fieldName].push({
                        action: directive.action,
                        subject: directive.subject || undefined,
                        field: directive.field || undefined,
                    });
                }
            }

            return fieldConfig;
        },
        [MapperKind.OBJECT_TYPE]: (type) => {
            const authDirectives = getDirective(schema, type, directiveName);
            if (authDirectives) {
                for (const directive of authDirectives) {
                    if (!authedOutputFields[type.name]) {
                        authedOutputFields[type.name] = {};
                    }
                    if (!authedOutputFields[type.name]["*"]) {
                        authedOutputFields[type.name]["*"] = [];
                    }
                    // If a field is provided, then subject is required.
                    if (directive.field && !directive.subject) {
                        throw new Error(
                            "Misconfigured GraphQL field has authorization directive(s) with field but no subject."
                        );
                    }
                    authedOutputFields[type.name]["*"].push({
                        action: directive.action,
                        subject: directive.subject || undefined,
                        field: directive.field || undefined,
                    });
                }
            }

            return type;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
            const authDirectives = getDirective(
                schema,
                fieldConfig,
                directiveName
            );

            if (authDirectives) {
                for (const directive of authDirectives) {
                    if (!authedOutputFields[typeName]) {
                        authedOutputFields[typeName] = {};
                    }
                    if (!authedOutputFields[typeName][fieldName]) {
                        authedOutputFields[typeName][fieldName] = [];
                    }
                    // If a field is provided, then subject is required.
                    if (directive.field && !directive.subject) {
                        throw new Error(
                            "Misconfigured GraphQL field has authorization directive(s) with field but no subject."
                        );
                    }
                    authedOutputFields[typeName][fieldName].push({
                        action: directive.action,
                        subject: directive.subject || undefined,
                        field: directive.field || undefined,
                    });
                }
            }
            return fieldConfig;
        },
    });
}

/**
 * Add a handler to check whether a user is authorized to use some argument for a field. This method does two main
 *   things:
 *   1. It checks which @Auth directives are applied to the given argument.
 *   2. For each @Auth directive, it adds a check to the resolver which checks whether the user is authorized to use
 *      the argument in question. If not, a GraphQLYogaError is thrown in the resolver.
 * @param fieldConfig The fieldConfig object received from mapSchema()
 * @param fieldName The name of the field
 * @param typeName The type which the field belongs to
 * @param argName The name of the argument on the field
 * @returns A new or modified fieldConfig object
 */
function addHandlerForArgumentsAuthDirectives(
    fieldConfig: GraphQLFieldConfig<any, any>,
    fieldName: string,
    typeName: string,
    argName: string
): GraphQLFieldConfig<any, any> {
    const argAuthDirectives = getAuthDirectivesForArgument(
        typeName,
        fieldName,
        argName
    );
    for (const directive of argAuthDirectives) {
        const resolver = fieldConfig.resolve || defaultFieldResolver;
        fieldConfig.resolve = async (
            parent,
            args,
            ctx: GraphQLContext,
            info
        ): Promise<unknown> => {
            // Only check if the argument is being used
            if (args[argName] !== undefined) {
                // Check if the user is allowed to use the argument. If not, throw an error.
                logger.debug(
                    { directive },
                    `Checking if user is authorized to use argument ${argName} on field ${typeName}.${fieldName}`
                );
                if (
                    !ctx.permissions.can(
                        directive.action,
                        directive.subject,
                        directive.field
                    )
                ) {
                    throw new GraphQLYogaError(
                        "Insufficient permissions to use argument " + argName
                    );
                }
            }
            return resolver(parent, args, ctx, info);
        };
    }
    return fieldConfig;
}

/**
 * Add a handler to check whether a user is authorized to use some field on an input type. This method does two main
 *   things:
 *   1. It checks which @Auth directives are applied to the input type field.
 *   2. For each @Auth directive, it adds a check to the resolver which checks whether the user is authorized to use
 *      the field in question. If not, a GraphQLYogaError is thrown in the resolver.
 * @param fieldConfig The fieldConfig object received from mapSchema()
 * @param fieldName The name of the input field
 * @param typeName The input type which the field belongs to
 * @param argName The name of the argument, which is used for getting the type and value.
 * @returns A new or modified fieldConfig object
 */
function addHandlerForInputFieldsAuthDirectives(
    fieldConfig: GraphQLFieldConfig<any, any>,
    fieldName: string,
    typeName: string,
    argName: string
): GraphQLFieldConfig<any, any> {
    if (!fieldConfig.args) {
        // Should never happen.
        throw new Error(
            "Field has no args, yet it was attempted to add handlers for input auth directives to it." +
                " Field config: " +
                JSON.stringify(fieldConfig)
        );
    }

    const argType = getRawType(fieldConfig.args[argName].type.toString());
    // If this is a scalar, then it doesn't make sense to check its properties for auth directives.
    if (listOfScalars.includes(argType)) {
        return fieldConfig;
    }

    const resolver = fieldConfig.resolve || defaultFieldResolver;
    fieldConfig.resolve = async (
        parent,
        args,
        ctx: GraphQLContext,
        info
    ): Promise<unknown> => {
        // Simplify code by checking if the argument is an object, and if so, just make it a one-item array. This way
        //   all items can just be handled as arrays.
        let arrayOfValues;
        if (Array.isArray(args[argName])) {
            arrayOfValues = args[argName];
        } else {
            arrayOfValues = [args[argName]];
        }

        // For each actual value passed...
        for (const element of arrayOfValues) {
            // For each property on the value...
            for (const prop in element) {
                const inputAuthDirectives = getAuthDirectivesForInputField(
                    argType,
                    prop
                );
                // For each @Auth directive applied to that property...
                for (const directive of inputAuthDirectives) {
                    // Hide password values from logs
                    const elementCopy = element;
                    delete elementCopy.password;
                    logger.debug(
                        { directive, element: elementCopy },
                        `Checking if user is authorized to use input field ${argType}.${prop}.`
                    );
                    // Check whether the user satisfies the @Auth directives requirements. If not, throw an error.
                    if (
                        !ctx.permissions.can(
                            directive.action,
                            subject(directive.subject, element[prop]),
                            directive.field
                        )
                    ) {
                        throw new GraphQLYogaError(
                            "Insufficient permissions to use input field " +
                                prop
                        );
                    }
                }
            }
        }
        return resolver(parent, args, ctx, info);
    };

    return fieldConfig;
}

/**
 * Add a handler to check whether a user is authorized to read some field on an output type. This method does two main
 *   things:
 *   1. It checks which @Auth directives are applied to the output type field.
 *   2. For each @Auth directive, it adds a check to the resolver which checks whether the user is authorized to read
 *      the field in question. If not, a GraphQLYogaError is thrown in the resolver.
 * @param fieldConfig The fieldConfig object received from mapSchema()
 * @param fieldName The name of the output field
 * @param typeName The output type which the field belongs to
 * @returns A new or modified fieldConfig object
 */
function addHandlerForOutputFieldsAuthDirectives(
    fieldConfig: GraphQLFieldConfig<any, any>,
    fieldName: string,
    typeName: string
): GraphQLFieldConfig<any, any> {
    // For top-level resolvers we need to check permissions for "our own" resolver too instead of just
    // "our children's" resolvers. Top-level resolvers don't have a parent which already did this check.
    if (
        typeName === "Query" ||
        typeName === "Mutation" ||
        typeName === "Subscription"
    ) {
        const outputAuthDirectives = getAuthDirectivesForOutputField(
            typeName,
            fieldName
        );
        for (const directive of outputAuthDirectives) {
            const resolver = fieldConfig.resolve || defaultFieldResolver;
            fieldConfig.resolve = async (
                parent,
                args,
                ctx: GraphQLContext,
                info
            ): Promise<unknown> => {
                logger.debug(
                    { directive },
                    `Checking if user is authorized to read output field ${typeName}.${fieldName}`
                );
                if (
                    !ctx.permissions.can(
                        directive.action,
                        directive.subject,
                        directive.field
                    )
                ) {
                    throw new GraphQLYogaError(
                        "Insufficient permissions to access field " + fieldName
                    );
                }

                return resolver(parent, args, ctx, info);
            };
        }
    }

    // Check if the user is allowed to read all the requested child fields. If not, throw an error.
    //   We do this here instead of inside the child resolver to avoid giving away whether this field is null.
    //   If it is null, then the child resolver will not be called, and their permission checks wouldn't happen.
    const resolver = fieldConfig.resolve || defaultFieldResolver;
    fieldConfig.resolve = async (
        parent,
        args,
        ctx: GraphQLContext,
        info
    ): Promise<unknown> => {
        const ownType = getRawType(info.returnType.toString());
        for (const child of info.fieldNodes[0].selectionSet?.selections ?? []) {
            if (child.kind === "Field") {
                const childName = child.name.value;
                const childFieldAuthDirectives =
                    getAuthDirectivesForOutputField(ownType, childName);
                for (const childDirective of childFieldAuthDirectives) {
                    logger.debug(
                        { childDirective },
                        `Checking if user is authorized to read output field ${ownType}.${childName}`
                    );
                    if (
                        !ctx.permissions.can(
                            childDirective.action,
                            childDirective.subject,
                            childDirective.field
                        )
                    ) {
                        throw new GraphQLYogaError(
                            "Insufficient permissions to access field " +
                                childName
                        );
                    }
                }
            }
        }
        const returnedObject = await resolver(parent, args, ctx, info);
        // Delete password before logging/returning. Should NEVER be accessible.
        if (parent) {
            delete parent.password;
        }

        for (const child of info.fieldNodes[0].selectionSet?.selections ?? []) {
            if (child.kind === "Field") {
                const childName = child.name.value;
                const childFieldAuthDirectives =
                    getAuthDirectivesForOutputField(ownType, childName);
                for (const childDirective of childFieldAuthDirectives) {
                    if (childDirective.subject === ownType) {
                        let returnedValueAsArray: unknown[] = [];
                        if (Array.isArray(returnedObject)) {
                            returnedValueAsArray = returnedObject;
                        } else {
                            returnedValueAsArray = [returnedObject];
                        }

                        for (const returnedValue of returnedValueAsArray) {
                            // Hide password values from logs
                            const parentCopy = parent;
                            if (parent) {
                                delete parent.password;
                            }
                            const returnedValueCopy = returnedValue;
                            if (returnedValue) {
                                delete (<any>returnedValueCopy).password;
                            }
                            logger.debug(
                                {
                                    childDirective,
                                    returnedValue: returnedValueCopy,
                                    parent: parentCopy,
                                },
                                `Checking if user is authorized to read output object with field ${ownType}.${childName}`
                            );
                            // Check if the user is allowed to access the field on this specific object. If not, throw an error.
                            if (
                                returnedValue !== null &&
                                !ctx.permissions.can(
                                    childDirective.action,
                                    subject(
                                        childDirective.subject,
                                        <any>returnedValue
                                    ),
                                    childDirective.field
                                )
                            ) {
                                throw new GraphQLYogaError(
                                    "Insufficient permissions to access field " +
                                        childName
                                );
                            }
                        }
                    }
                }
            }
        }

        return returnedObject;
    };
    return fieldConfig;
}

/**
 * Attach handlers to each resolver which has the @Auth directive. Multiple @Auth directives may be applied to one
 *   resolver/field. This also takes care of handling the directives on arguments.
 */
export function authDirective(
    directiveName: string
): (schema: GraphQLSchema) => GraphQLSchema {
    return (schema: GraphQLSchema): GraphQLSchema => {
        // Search through the provided schema to get all the locations the @Auth directive is used, and cache them.
        collectAuthDirectiveDefinitions(directiveName, schema);
        // Modify the resolvers for all fields to check the @Auth directive usages, to see if the user is allowed.
        return mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                fieldConfig = addHandlerForOutputFieldsAuthDirectives(
                    fieldConfig,
                    fieldName,
                    typeName
                );
                for (const arg in fieldConfig.args) {
                    fieldConfig = addHandlerForArgumentsAuthDirectives(
                        fieldConfig,
                        fieldName,
                        typeName,
                        arg
                    );
                    fieldConfig = addHandlerForInputFieldsAuthDirectives(
                        fieldConfig,
                        fieldName,
                        typeName,
                        arg
                    );
                }
                return fieldConfig;
            },
        });
    };
}
