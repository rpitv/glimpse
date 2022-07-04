import {
    MutationResolvers,
    Pagination,
    QueryResolvers,
    Resolvers,
} from "./generated/graphql";
import {AccessLog, AlertLog} from "@prisma/client";
import {GraphQLContext} from "custom";
import {GraphQLScalarType} from "graphql";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {constructPagination, getAccessibleByFilter} from "./utils";
import {subject} from "@casl/ability";

type CrudGeneratorOptions<Type = string> = {
    findMany: boolean;
    findOne: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    incomingRelations: Type[];
    outgoingRelations: Type[];
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
    fields: (keyof NonNullable<Resolvers[ModelName]>)[]
): Resolvers[ModelName] {
    const fieldResolvers: Resolvers[ModelName] = {};
    for (const fieldName of fields) {
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
            const objAtCursor = (<any>(await ctx.prisma[modelNameToPrismaDelegateMap[modelName]]))
                .findUnique({where: {id: pagination.cursor.id}});

            if (!objAtCursor || !ctx.permissions.can("read", subject(modelName, objAtCursor), "id")) {
                return [];
            }
        }

        // Get the requested objects as a list. Required casting which should be removed if possible (probably custom
        // Prisma generator?). TypeScript doesn't know which version of findMany to use. Fine in our case since all
        // data types have ID. Potentially relevant: https://github.com/prisma/prisma/issues/5273
        return (<any>(ctx.prisma[modelNameToPrismaDelegateMap[modelName]])).findMany({
            ...pagination,
            where: getAccessibleByFilter(ctx.permissions, "read")[modelName],
        });
    };

    return queryResolvers;
}

function generateCreateResolver<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    fields: (keyof NonNullable<Resolvers[ModelName]>)[]
): MutationResolvers {
    const mutationResolvers: MutationResolvers = {};

    // @ts-ignore FIXME - Due to the fact that not all CRUD resolvers have create, this is a workaround.
    mutationResolvers[`create${modelName}`] = async (
        parent: unknown,
        args: { input: any },
        ctx: GraphQLContext
    ): Promise<any> => {
        // Check that user is allowed to create the passed object. Fields aren't relevant in this context.
        if (!ctx.permissions.can("create", subject(modelName, args.input))) {
            throw new GraphQLYogaError("Insufficient permissions");
        }

        for(const field of fields) {
            let matchingValue;
            if(args.input[field] !== undefined) {

            }
        }

        // If person is being updated to a new Person, check that the current user has permission to read the new
        //   Person, and then connect it. Only ID needs to be selected.
        let person = undefined;
        if (args.input.person) {
            person = await ctx.prisma.person.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, "read").Person,
                        {id: parseInt(args.input.person)},
                    ],
                },
                select: {id: true},
            });
            if (person === null) {
                throw new GraphQLYogaError("Person does not exist");
            }
            // Wrap person object in a Prisma relation input.
            person = {connect: person};
        }
    }

    return mutationResolvers;
}

export function generateCrudResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    crudOptions: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): Resolvers<GraphQLContext> {
    const resolvers: Resolvers<GraphQLContext> = {};
    resolvers[modelName] = generateRelationResolvers(
        modelName,
        [...crudOptions.outgoingRelations, ...crudOptions.incomingRelations]
    );
    if (crudOptions.findMany) {
        resolvers.Query = generateFindManyResolver(modelName);
    }
    if (crudOptions.findOne) {
        resolvers.Query = {
            ...resolvers.Query,
            ...generateFindOneResolver(modelName),
        };
    }
    if(crudOptions.create) {
        resolvers.Mutation = generateCreateResolver(modelName, crudOptions.outgoingRelations);
    }
    return resolvers;
}
