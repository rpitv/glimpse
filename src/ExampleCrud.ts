import {
    MutationResolvers,
    Pagination,
    QueryResolvers,
    Resolvers,
} from "./generated/graphql";
import {GraphQLContext} from "custom";
import {GraphQLScalarType} from "graphql";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {constructPagination, getAccessibleByFilter} from "./utils";
import {subject} from "@casl/ability";
import {canCreate, canDelete, canUpdate} from "./permissions";
import {logger} from "./logger";

type CrudGeneratorOptions<Type extends string | number | symbol = string> = {
    findMany?: boolean;
    findOne?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    readOnlyRelations?: Type[];
    writableRelations?: Partial<Record<Type, ValidCrudResolvers>>;
};

type OmitChildType<Type, OmittedChild> = {
    [P in keyof Type as NonNullable<Type[P]> extends OmittedChild
        ? never
        : P]: Type[P];
};

type ValidCrudResolvers = keyof OmitChildType<Resolvers<GraphQLContext>,
    GraphQLScalarType | MutationResolvers | QueryResolvers>;

type PrismaDelegateName =
    | "accessLog"
    | "alertLog"
    | "asset"
    | "auditLog"
    | "blogPost"
    | "category"
    | "contactSubmissionAssignee"
    | "contactSubmission"
    | "credit"
    | "groupPermission"
    | "group"
    | "image"
    | "person"
    | "personImage"
    | "productionImage"
    | "productionRSVP"
    | "productionTag"
    | "productionVideo"
    | "production"
    | "redirect"
    | "role"
    | "userGroup"
    | "userPermission"
    | "user"
    | "video"
    | "voteResponse"
    | "vote";

const modelNameToPrismaDelegateMap: Record<ValidCrudResolvers,
    PrismaDelegateName> = {
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
    const relations = [
        ...options.readOnlyRelations || [],
        ...Object.keys(options.writableRelations || {})
    ];
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
            logger.debug(`Querying prisma for field ${fieldName.toString()} in ${modelName} CRUD relational resolver`);
            const obj = await (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findFirst({
                where: {id: parent.id},
                select: {[fieldName]: true},
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
    modelName: ModelName
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
        logger.debug(`Querying prisma for ${modelName} in CRUD findOne resolver`);
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findFirst({
            where: {
                AND: [
                    getAccessibleByFilter(ctx.permissions, "read")[modelName],
                    {id: parseInt(args.id)},
                ],
            },
        });
    };

    return queryResolvers;
}

function generateFindManyResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName
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
            logger.debug(`Querying prisma for cursor object in CRUD ${modelName} findMany resolver`);
            const objAtCursor = (<any>(await ctx.prisma[modelNameToPrismaDelegateMap[modelName]]))
                .findUnique({where: {id: pagination.cursor.id}});

            if (!objAtCursor || !ctx.permissions.can("read", subject(modelName, objAtCursor), "id")) {
                return [];
            }
        }

        // Get the requested objects as a list. Required casting which should be removed if possible (probably custom
        // Prisma generator?). TypeScript doesn't know which version of findMany to use. Fine in our case since all
        // data types have ID. Potentially relevant: https://github.com/prisma/prisma/issues/5273
        logger.debug(`Querying prisma for ${modelName}s in CRUD findMany resolver`);
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findMany({
            ...pagination,
            where: getAccessibleByFilter(ctx.permissions, "read")[modelName],
        });
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
        if(!canCreate(ctx.permissions, modelName, args.input)) {
            throw new GraphQLYogaError(`Insufficient permissions to create ${modelName} with provided values`);
        }

        // Check that the user has permission to read relational fields values. For example, If roleId = 1, then
        //   the user must have permission to read the Role with id = 1.
        for (const field in options.writableRelations) {
            if (args.input[field] !== undefined && args.input[field] !== null) {
                // <any> casts are required here and below because we use a Partial in writableRelations.
                logger.debug(`Querying prisma for ${modelName}'s relational field ${field} in CRUD create resolver`);
                const prismaDelegate = ((<any>ctx.prisma)[(<any>modelNameToPrismaDelegateMap)
                    [options.writableRelations[field]]]);
                const matchingValue = await prismaDelegate.findFirst({
                    where: {
                        AND: [
                            (<any>getAccessibleByFilter(ctx.permissions, "read"))[options.writableRelations[field]],
                            {id: parseInt(args.input[field])},
                        ],
                    },
                    select: {id: true},
                });
                if (matchingValue === null) {
                    throw new GraphQLYogaError(`Object with ID matching ${field.toString()} does not exist`);
                }
                // Wrap the ID in a Prisma connect object, to be used in the create call.
                args.input[field] = {connect: matchingValue};
            }
        }

        // testing.priority = args.input.priority;
        // Create the object. Permissions have already been checked by @Auth directives.
        logger.debug({input: args.input}, `Querying prisma to create ${modelName} in CRUD create resolver`);
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).create({
            data: args.input,
        });
    }

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
        args: { input: any, id: string },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Check that the requested object exists. If not, we say they can't update it to avoid leaking information.
        // If it does exist, make sure the user has permission to update it.
        logger.debug(`Querying prisma for ${modelName} in CRUD update resolver`);
        const obj = await (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findUnique({
            where: {id: parseInt(args.id)}
        });
        if (!obj || !canUpdate(ctx.permissions, modelName, obj, {...obj, ...args.input})) {
            throw new GraphQLYogaError(`Insufficient permissions to update ${modelName} with ID ${args.id}`);
        }

        // Check that the user has permission to read relational fields values. For example, If roleId = 1, then
        //   the user must have permission to read the Role with id = 1.
        for (const field in options.writableRelations) {
            if (args.input[field] !== undefined && args.input[field] !== null) {
                // <any> casts are required here and below because we use a Partial in writableRelations.
                logger.debug(`Querying prisma for ${modelName}'s relational field ${field} in CRUD update resolver`);
                const prismaDelegate = ((<any>ctx.prisma)[(<any>modelNameToPrismaDelegateMap)
                    [options.writableRelations[field]]]);
                const matchingValue = await prismaDelegate.findFirst({
                    where: {
                        AND: [
                            (<any>getAccessibleByFilter(ctx.permissions, "read"))[options.writableRelations[field]],
                            {id: parseInt(args.input[field])},
                        ],
                    },
                    select: {id: true},
                });
                if (matchingValue === null) {
                    throw new GraphQLYogaError(`Object with ID matching ${field.toString()} does not exist`);
                }
                // Wrap the ID in a Prisma connect object, to be used in the create call.
                args.input[field] = {connect: matchingValue};
            }
        }

        // Update the object.
        logger.debug(`Querying prisma to update ${modelName} in CRUD update resolver`);
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).update({
            where: {id: parseInt(args.id)},
            data: args.input,
        });
    }

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
        logger.debug(`Querying prisma for ${modelName} in CRUD delete resolver`);
        const obj = await (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findUnique({
            where: {id: parseInt(args.id)}
        });
        if (!obj || !canDelete(ctx.permissions, modelName, obj)) {
            throw new GraphQLYogaError(`Insufficient permissions to delete ${modelName} with ID ${args.id}`);
        }

        // Delete the object.
        logger.debug(`Querying prisma to delete ${modelName} in CRUD delete resolver`);
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).delete({
            where: {id: parseInt(args.id)}
        });
    }

    return mutationResolvers;
}

export function generateCrudResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    crudOptions: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): Resolvers<GraphQLContext> {
    const resolvers: Resolvers<GraphQLContext> = {};
    resolvers[modelName] = generateRelationResolvers(modelName, crudOptions);
    if (crudOptions.findMany) {
        resolvers.Query = generateFindManyResolver(modelName);
    }
    if (crudOptions.findOne) {
        resolvers.Query = {
            ...resolvers.Query,
            ...generateFindOneResolver(modelName),
        };
    }
    if (crudOptions.create) {
        resolvers.Mutation = generateCreateResolver(modelName, crudOptions);
    }
    if (crudOptions.update) {
        resolvers.Mutation = {
            ...resolvers.Mutation,
            ...generateUpdateResolver(modelName, crudOptions),
        }
    }
    if (crudOptions.delete) {
        resolvers.Mutation = {
            ...resolvers.Mutation,
            ...generateDeleteResolver(modelName),
        }
    }
    return resolvers;
}
