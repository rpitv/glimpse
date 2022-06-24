import {Asset, User} from "@prisma/client";
import {Resolvers} from "../generated/graphql";
import {GraphQLContext} from "custom";
import {constructPagination, getAccessibleByFilter} from "../utils";
import {subject} from "@casl/ability";
import {GraphQLYogaError} from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Query: {
        assets: async (parent, args, ctx: GraphQLContext): Promise<Asset[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the Asset at the cursor. If not, return empty array, as if the Asset didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const asset = await ctx.prisma.asset.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (asset === null || !ctx.permissions.can('read', subject("Asset", asset), "id")) {
                    return [];
                }
            }

            // Get the Assets that the user has permission to read, and inject pagination object.
            return await ctx.prisma.asset.findMany({
                where: getAccessibleByFilter(ctx.permissions, 'read').Asset,
                ...pagination
            });
        },
        asset: async (parent, args, ctx: GraphQLContext): Promise<Asset | null> => {
            // Get the Asset that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.asset.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'read').Asset,
                        {id: parseInt(args.id)}
                    ]
                }
            });
        }
    },
    Mutation: {
        createAsset: async (parent, args, ctx: GraphQLContext): Promise<Asset> => {
            // Check that user is allowed to create the passed Asset. Fields aren't relevant in this context.
            if (!ctx.permissions.can('create', subject('Asset', args.input))) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // If last known handler is being updated to a new User, check that the current user has permission to read
            //    the new User, and then connect it. Only ID needs to be selected.
            let newHandler = undefined;
            if (args.input.lastKnownHandler) {
                newHandler = await ctx.prisma.user.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, 'read').User,
                            {id: parseInt(args.input.lastKnownHandler)}
                        ]
                    },
                    select: {id: true}
                });
                if (newHandler === null) {
                    throw new GraphQLYogaError('Insufficient permissions');
                }
                // Wrap newHandler in Prisma relation input object.
                newHandler = { connect: newHandler };
            }

            // If the parent asset is being updated to a new Asset, check that the current user has permission to read
            //    the new Asset, and then connect it. Only ID needs to be selected.
            let newParent = undefined;
            if (args.input.parent) {
                newParent = await ctx.prisma.asset.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, 'read').Asset,
                            {id: parseInt(args.input.parent)}
                        ]
                    }
                });
                if (newParent === null) {
                    throw new GraphQLYogaError('Insufficient permissions');
                }
                // Wrap newParent in Prisma relation input object.
                newParent = { connect: newParent };
            }

            // Create the Asset.
            return await ctx.prisma.asset.create({
                data: {
                    tag: args.input.tag,
                    name: args.input.name,
                    lastKnownLocation: args.input.lastKnownLocation,
                    lastKnownHandler: newHandler,
                    isLost: args.input.isLost ?? false,
                    notes: args.input.notes,
                    purchasePrice: args.input.purchasePrice,
                    purchaseDate: args.input.purchaseDate,
                    purchaseLocation: args.input.purchaseLocation,
                    modelNumber: args.input.modelNumber,
                    serialNumber: args.input.serialNumber,
                    parent: newParent
                }
            });
        },
        updateAsset: async (parent, args, ctx: GraphQLContext): Promise<Asset> => {
            // Get the requested Asset in its current state.
            const asset = await ctx.prisma.asset.findUnique({
                where: {id: parseInt(args.id)}
            });
            // Check that this Asset exists and that the user has permission to update it.
            if (asset === null || !ctx.permissions.can('update', subject("Asset", asset), "id")) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // If last known handler is being updated to a new User, check that the current user has permission to read
            //    the new User, and then connect it. Otherwise, if person is being updated to null, disconnect the User.
            //    Only ID needs to be selected.
            let newHandler = undefined;
            if (args.input.lastKnownHandler) {
                newHandler = await ctx.prisma.user.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, 'read').User,
                            {id: parseInt(args.input.lastKnownHandler)}
                        ]
                    }
                });
                if (newHandler === null) {
                    throw new GraphQLYogaError('Insufficient permissions');
                }
                // Wrap newHandler in Prisma relation input object.
                newHandler = { connect: {id: newHandler.id} };
            } else if (args.input.lastKnownHandler === null) {
                // Disconnect if null was provided.
                newHandler = { disconnect: true };
            }

            // If the parent asset is being updated to a new Asset, check that the current user has permission to read
            //    the new Asset, and then connect it. Otherwise, if person is being updated to null, disconnect the Asset.
            //    Only ID needs to be selected.
            let newParent = undefined;
            if (args.input.parent) {
                newParent = await ctx.prisma.asset.findFirst({
                    where: {
                        AND: [
                            getAccessibleByFilter(ctx.permissions, 'read').Asset,
                            {id: parseInt(args.input.parent)}
                        ]
                    }
                });
                if (newParent === null) {
                    throw new GraphQLYogaError('Insufficient permissions');
                }
                // Wrap newParent in Prisma relation input object.
                newParent = { connect: {id: newParent.id} };
            } else if (args.input.parent === null) {
                newParent = { disconnect: true };
            }

            // Update the Asset.
            return await ctx.prisma.asset.update({
                where: {id: parseInt(args.id)},
                data: {
                    tag: args.input.tag,
                    name: args.input.name,
                    lastKnownLocation: args.input.lastKnownLocation,
                    lastKnownHandler: newHandler,
                    notes: args.input.notes,
                    purchasePrice: args.input.purchasePrice,
                    purchaseDate: args.input.purchaseDate,
                    purchaseLocation: args.input.purchaseLocation,
                    modelNumber: args.input.modelNumber,
                    serialNumber: args.input.serialNumber,
                    parent: newParent
                }
            });
        },
        deleteAsset: async (parent, args, ctx: GraphQLContext): Promise<Asset> => {
            // Get the Asset to delete, and check that the user has permission to delete it.
            const asset = await ctx.prisma.asset.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'delete').Asset,
                        {id: parseInt(args.id)}
                    ]
                }
            });
            // If null is returned, the Asset doesn't exist or the user doesn't have permission to delete it.
            if (asset === null) {
                throw new GraphQLYogaError('Insufficient permissions');
            }

            // Delete the Asset.
            return await ctx.prisma.asset.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    Asset: {
        lastKnownHandler: async (parent, args, ctx: GraphQLContext): Promise<User | null> => {
            // Get the requested Asset, selecting the last known handler.
            const asset = await ctx.prisma.asset.findUnique({
                where: {id: parent.id},
                select: {lastKnownHandler: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (asset === null) {
                throw new GraphQLYogaError('Asset is unexpectedly null');
            }
            // Return the last known handler.
            return asset.lastKnownHandler;
        },
        parent: async (parent, args, ctx: GraphQLContext): Promise<Asset | null> => {
            // Get the requested Asset, selecting the parent.
            const asset = await ctx.prisma.asset.findUnique({
                where: {id: parent.id},
                select: {parent: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (asset === null) {
                throw new GraphQLYogaError('Asset is unexpectedly null');
            }
            // Return the parent.
            return asset.parent;
        }
    }
}
