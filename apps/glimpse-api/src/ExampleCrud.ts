import {MutationResolvers, QueryResolvers, Resolvers} from "./generated/graphql";
import {GraphQLContext} from "custom";
import {GraphQLScalarType} from "graphql";
import {GraphQLYogaError} from "@graphql-yoga/node";

type CrudGeneratorOptions<Type = string> = {
    findMany: boolean;
    findOne: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    relationalFields: Type[];
}

type OmitChildType<Type, OmittedChild> = { [P in keyof Type as NonNullable<Type[P]> extends OmittedChild ? never : P]: Type[P] };

type ValidCrudResolvers = keyof OmitChildType<Resolvers<GraphQLContext>, GraphQLScalarType | MutationResolvers | QueryResolvers>

type PrismaDelegateName =
    "accessLog"
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
const modelNameToPrismaDelegateMap: Record<ValidCrudResolvers, PrismaDelegateName> = {
    "AccessLog": "accessLog",
    "AlertLog": "alertLog",
    "Asset": "asset",
    "AuditLog": "auditLog",
    "BlogPost": "blogPost",
    "Category": "category",
    "ContactSubmissionAssignee": "contactSubmissionAssignee",
    "ContactSubmission": "contactSubmission",
    "Credit": "credit",
    "GroupPermission": "groupPermission",
    "Group": "group",
    "Image": "image",
    "Person": "person",
    "PersonImage": "personImage",
    "ProductionImage": "productionImage",
    "ProductionRSVP": "productionRSVP",
    "ProductionTag": "productionTag",
    "ProductionVideo": "productionVideo",
    "Production": "production",
    "Redirect": "redirect",
    "Role": "role",
    "UserGroup": "userGroup",
    "UserPermission": "userPermission",
    "User": "user",
    "Video": "video",
    "VoteResponse": "voteResponse",
    "Vote": "vote"
}

function generateRelationResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    fields: (keyof NonNullable<Resolvers[ModelName]>)[]
): Resolvers[ModelName] {
    const fieldResolvers: Resolvers[ModelName] = {};
    for (const fieldName of fields) {
        // FIXME - Required casting which should be removed. Casting required since keyof NonNullable<T> cannot
        //  index T. Looks like TS 4.8 contains a fix. https://github.com/microsoft/TypeScript/issues/23368
        (<any>fieldResolvers)[fieldName] = async (parent: { id?: number }, args: unknown, ctx: GraphQLContext): Promise<any> => {
            // Get the requested object, selecting the requested property. Required casting which should be removed
            //  if possible (probably custom Prisma generator?). TypeScript doesn't know which version of findFirst
            //  to use. Fine in our case since all data types have ID. Potentially relevant:
            //  https://github.com/prisma/prisma/issues/5273
            const obj = (<any>await ctx.prisma[modelNameToPrismaDelegateMap[modelName]]).findFirst({
                where: {id: parent.id},
                select: {[fieldName]: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (obj === null) {
                throw new GraphQLYogaError(`${modelName} is unexpectedly null`);
            }
            // Return the requested property.
            return obj[fieldName];
        }
    }
    return fieldResolvers;
}

function generateQueryResolvers<ModelName extends ValidCrudResolvers>(modelName: ModelName): QueryResolvers {
    const fieldResolvers: QueryResolvers = {};
    return fieldResolvers;
}

export function generateCrudResolvers<ModelName extends ValidCrudResolvers>(
    modelName: ModelName,
    crudOptions: CrudGeneratorOptions<keyof NonNullable<Resolvers[ModelName]>>
): Resolvers<GraphQLContext> {

    const resolvers: Resolvers<GraphQLContext> = {};
    resolvers[modelName] = generateRelationResolvers(modelName, crudOptions.relationalFields);
    return resolvers;
}

generateCrudResolvers("Category", {
    findMany: true,
    findOne: true,
    create: true,
    update: true,
    delete: true,
    relationalFields: ["parent"]
});
