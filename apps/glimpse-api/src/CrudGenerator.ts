import {
    MutationResolvers,
    Pagination,
    QueryResolvers,
    Resolvers,
} from "./generated/graphql";
import {
    CrudGeneratorOptions,
    GraphQLContext,
    PrismaDelegateName,
    ValidCrudResolvers,
} from "custom";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { constructPagination, getAccessibleByFilter } from "./utils";
import { subject } from "@casl/ability";
import { canCreate, canDelete, canUpdate } from "./permissions";
import { logger } from "./logger";

const modelNameToPrismaDelegateMap: Record<
    ValidCrudResolvers,
    PrismaDelegateName
> = {
    AccessLog: "accessLog",
    AlertLog: "alertLog",
    Asset: "asset",
    AuditLog: "auditLog",
    BlogPost: "blogPost",
    Category: "category",
    ContactSubmissionAssignee: "contactSubmissionAssignee",
    ContactSubmission: "contactSubmission",
    Credit: "credit",
    GroupPermission: "groupPermission",
    Group: "group",
    Image: "image",
    Person: "person",
    PersonImage: "personImage",
    ProductionImage: "productionImage",
    ProductionRSVP: "productionRSVP",
    ProductionTag: "productionTag",
    ProductionVideo: "productionVideo",
    Production: "production",
    Redirect: "redirect",
    Role: "role",
    UserGroup: "userGroup",
    UserPermission: "userPermission",
    User: "user",
    Video: "video",
    VoteResponse: "voteResponse",
    Vote: "vote",
};

function generateRelationResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    options: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): Resolvers[ModelName] {
    const fieldResolvers: Resolvers[ModelName] = {};
    const relations = [...(options.relations || [])];
    for (const fieldName of relations) {
        // FIXME - Required casting which should be removed. Casting required since keyof NonNullable<T> cannot
        //  index T. Looks like TS 4.8 contains a fix. https://github.com/microsoft/TypeScript/issues/23368
        (<any>fieldResolvers)[fieldName] = async (
            parent: { id?: number },
            args: unknown,
            ctx: GraphQLContext
        ): Promise<any> => {
            // Get the requested object, selecting the requested property. Required casting which should be removed
            //  if possible (probably custom Prisma generator?). TypeScript doesn't know which version of findFirst
            //  to use. Fine in our case since all data types have ID. Potentially relevant:
            //  https://github.com/prisma/prisma/issues/5273
            logger.debug(
                `Querying prisma for field ${fieldName.toString()} in ${modelName} CRUD relational resolver`
            );
            const obj = await (<any>(
                ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
            )).findFirst({
                where: { id: parent.id },
                select: { [fieldName]: true },
            });

            // This should never happen since the parent resolver would have returned null.
            if (obj === null) {
                throw new GraphQLYogaError(`${modelName} is unexpectedly null`);
            }
            // Return the requested property.
            return obj[fieldName];
        };
    }
    return fieldResolvers;
}

function generateFindOneResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    options: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): QueryResolvers {
    const queryResolvers: QueryResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have findOne, this is a workaround.
    queryResolvers[`findOne${modelName}`] = async (
        parent: unknown,
        args: { id: string },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Get the requested objects as a list. Required casting which should be removed if possible (probably custom
        // Prisma generator?). TypeScript doesn't know which version of findMany to use. Fine in our case since all
        // data types have ID. Potentially relevant: https://github.com/prisma/prisma/issues/5273
        logger.debug(
            `Querying prisma for ${modelName} in CRUD findOne resolver`
        );
        const returnedValue = await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).findFirst({
            where: {
                AND: [
                    getAccessibleByFilter(ctx.permissions, "read")[modelName],
                    { id: parseInt(args.id) },
                ],
            },
        });

        // Apply any transformations to output fields. This usually also performs any necessary additional perm checks.
        for (const readTransformer in options.transformers?.read) {
            if (returnedValue[readTransformer] !== undefined) {
                logger.debug(
                    `Applying transformer for output field ${modelName}.${readTransformer} in CRUD findOne resolver`
                );
                returnedValue[readTransformer] =
                    await options.transformers?.read[readTransformer]?.(
                        returnedValue[readTransformer],
                        ctx
                    );
            }
        }

        return returnedValue;
    };

    return queryResolvers;
}

function generateFindManyResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    options: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): QueryResolvers {
    const queryResolvers: QueryResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have findMany, this is a workaround.
    queryResolvers[`findMany${modelName}`] = async (
        parent: unknown,
        args: { pagination: Pagination },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
        //   read the User at the cursor. If not, return empty array, as if the User didn't exist.
        const pagination = constructPagination(args);
        if (pagination.cursor) {
            // Get the object that the cursor points to. Required casting which should be removed if possible (probably
            // custom Prisma generator?). TypeScript doesn't know which version of findMany to use. Fine in our case
            // since all data types have ID. Potentially relevant: https://github.com/prisma/prisma/issues/5273
            logger.debug(
                `Querying prisma for cursor object in CRUD ${modelName} findMany resolver`
            );
            const objAtCursor = await (<any>(
                ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
            )).findUnique({ where: { id: pagination.cursor.id } });

            if (
                !objAtCursor ||
                !ctx.permissions.can(
                    "read",
                    subject(modelName, objAtCursor),
                    "id"
                )
            ) {
                return [];
            }
        }

        // Get the requested objects as a list. Required casting which should be removed if possible (probably custom
        // Prisma generator?). TypeScript doesn't know which version of findMany to use. Fine in our case since all
        // data types have ID. Potentially relevant: https://github.com/prisma/prisma/issues/5273
        logger.debug(
            `Querying prisma for ${modelName}s in CRUD findMany resolver`
        );
        const returnedValues = await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).findMany({
            ...pagination,
            where: getAccessibleByFilter(ctx.permissions, "read")[modelName],
        });

        // Apply any transformations to output fields. This usually also performs any necessary additional perm checks.
        for (const readTransformer in options.transformers?.read) {
            for (const returnedValue of returnedValues) {
                if (returnedValue[readTransformer] !== undefined) {
                    logger.debug(
                        `Applying transformer for output field ${modelName}.${readTransformer} in CRUD findMany resolver`
                    );
                    returnedValue[readTransformer] =
                        await options.transformers?.read[readTransformer]?.(
                            returnedValue[readTransformer],
                            ctx
                        );
                }
            }
        }

        return returnedValues;
    };

    return queryResolvers;
}

function generateCreateResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    options: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): MutationResolvers {
    const mutationResolvers: MutationResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have create, this is a workaround.
    mutationResolvers[`create${modelName}`] = async (
        parent: unknown,
        args: { input: any },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Check that the user has permission to create an object like the one provided.
        if (!canCreate(ctx.permissions, modelName, args.input)) {
            throw new GraphQLYogaError(
                `Insufficient permissions to create ${modelName} with provided values`
            );
        }

        // Apply any transformations to input fields. This usually also performs any necessary additional perm checks.
        for (const writeTransformer in options.transformers?.write) {
            if (args.input[writeTransformer] !== undefined) {
                logger.debug(
                    `Applying transformer for input field ${modelName}.${writeTransformer} in CRUD create resolver`
                );
                args.input[writeTransformer] =
                    await options.transformers?.write[writeTransformer]?.(
                        args.input[writeTransformer],
                        ctx
                    );
            }
        }

        // testing.priority = args.input.priority;
        // Create the object. Permissions have already been checked by @Auth directives.
        logger.debug(
            { input: args.input },
            `Querying prisma to create ${modelName} in CRUD create resolver`
        );
        return await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).create({
            data: args.input,
        });
    };

    return mutationResolvers;
}

function generateUpdateResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    options: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): MutationResolvers {
    const mutationResolvers: MutationResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have update, this is a workaround.
    mutationResolvers[`update${modelName}`] = async (
        parent: unknown,
        args: { input: any; id: string },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Check that the requested object exists. If not, we say they can't update it to avoid leaking information.
        // If it does exist, make sure the user has permission to update it.
        logger.debug(
            `Querying prisma for ${modelName} in CRUD update resolver`
        );
        const obj = await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).findUnique({
            where: { id: parseInt(args.id) },
        });
        if (
            !obj ||
            !canUpdate(ctx.permissions, modelName, obj, {
                ...obj,
                ...args.input,
            })
        ) {
            throw new GraphQLYogaError(
                `Insufficient permissions to update ${modelName} with ID ${args.id}`
            );
        }

        // Apply any transformations to input fields. This usually also performs any necessary additional perm checks.
        for (const writeTransformer in options.transformers?.write) {
            if (args.input[writeTransformer] !== undefined) {
                logger.debug(
                    `Applying transformer for input field ${modelName}.${writeTransformer} in CRUD create resolver`
                );
                args.input[writeTransformer] =
                    await options.transformers?.write[writeTransformer]?.(
                        args.input[writeTransformer],
                        ctx
                    );
            }
        }

        // Update the object.
        logger.debug(
            `Querying prisma to update ${modelName} in CRUD update resolver`
        );
        return await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).update({
            where: { id: parseInt(args.id) },
            data: args.input,
        });
    };

    return mutationResolvers;
}

function generateDeleteResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName
): MutationResolvers {
    const mutationResolvers: MutationResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have delete, this is a workaround.
    mutationResolvers[`delete${modelName}`] = async (
        parent: unknown,
        args: { id: string },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Check that the requested object exists. If not, we say they can't delete it to avoid leaking information.
        // If it does exist, make sure the user has permission to delete it.
        logger.debug(
            `Querying prisma for ${modelName} in CRUD delete resolver`
        );
        const obj = await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).findUnique({
            where: { id: parseInt(args.id) },
        });
        if (!obj || !canDelete(ctx.permissions, modelName, obj)) {
            throw new GraphQLYogaError(
                `Insufficient permissions to delete ${modelName} with ID ${args.id}`
            );
        }

        // Delete the object.
        logger.debug(
            `Querying prisma to delete ${modelName} in CRUD delete resolver`
        );
        return await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).delete({
            where: { id: parseInt(args.id) },
        });
    };

    return mutationResolvers;
}

export function generateCrudResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    crudOptions: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): Resolvers<GraphQLContext> {
    const resolvers: Resolvers<GraphQLContext> = {};
    resolvers[modelName] = generateRelationResolvers(modelName, crudOptions);
    if (crudOptions.findMany) {
        resolvers.Query = generateFindManyResolver(modelName, crudOptions);
    }
    if (crudOptions.findOne) {
        resolvers.Query = {
            ...resolvers.Query,
            ...generateFindOneResolver(modelName, crudOptions),
        };
    }
    if (crudOptions.create) {
        resolvers.Mutation = generateCreateResolver(modelName, crudOptions);
    }
    if (crudOptions.update) {
        resolvers.Mutation = {
            ...resolvers.Mutation,
            ...generateUpdateResolver(modelName, crudOptions),
        };
    }
    if (crudOptions.delete) {
        resolvers.Mutation = {
            ...resolvers.Mutation,
            ...generateDeleteResolver(modelName),
        };
    }
    return resolvers;
}

/**
 * Transformer for an input ID field to turn it into a number, and also performs permission checks to make sure the
 *   user has permission to read the object that the ID is referring to
 * @param modelName Name of the model that the ID field is for
 */
export function relationalIdWriteTransformer(
    modelName: ValidCrudResolvers
): (val: string, ctx: GraphQLContext) => Promise<number> | number {
    return async (val: string, ctx: GraphQLContext) => {
        // IDs which are null are used to signify a disconnection from a relational field. No permission checks or
        //   transformations are needed.
        if (val === null) {
            return val;
        }

        const idAsNumber = parseInt(val, 10);
        if (isNaN(idAsNumber)) {
            throw new Error(`Invalid ID: ${val}`);
        }

        // Check that the user has permission to read the requested object to be written.
        const obj = await (<any>(
            ctx.prisma[modelNameToPrismaDelegateMap[modelName]]
        )).findFirst({
            where: {
                AND: [
                    getAccessibleByFilter(ctx.permissions, "read")[modelName],
                    { id: idAsNumber },
                ],
            },
            select: { id: true },
        });
        if (obj === null) {
            throw new GraphQLYogaError(
                `${modelName} with ID ${val} does not exist`
            );
        }

        // Return the ID as a number instead of the default string from ID scalar.
        return idAsNumber;
    };
}
