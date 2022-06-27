import {Category, Production} from "@prisma/client";
import {Resolvers} from "../generated/graphql";
import {GraphQLContext} from "custom";
import {constructPagination, getAccessibleByFilter} from "../utils";
import {subject} from "@casl/ability";
import {canUpdate} from "../permissions";
import {GraphQLYogaError} from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Query: {
        categories: async (parent, args, ctx: GraphQLContext): Promise<Category[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the Category at the cursor. If not, return empty array, as if the Category didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const category = await ctx.prisma.category.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (category === null || !ctx.permissions.can('read', subject("Category", category), "id")) {
                    return [];
                }
            }

            // Get the Categories that the user has permission to read, and inject pagination object.
            return ctx.prisma.category.findMany({
                where: getAccessibleByFilter(ctx.permissions, 'read').Category,
                ...pagination
            });
        },
        category: async (parent, args, ctx: GraphQLContext): Promise<Category | null> => {
            // Return the Category that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.category.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.id)},
                        getAccessibleByFilter(ctx.permissions, 'read').Category
                    ]
                }
            });
        }
    },
    Mutation: {
        createCategory: async (parent, args, ctx: GraphQLContext): Promise<Category> => {
            // Check that user is allowed to create the passed Category. Fields aren't relevant in this context.
            if (!ctx.permissions.can('create', subject("Category", args.input))) {
                throw new Error("Insufficient permissions");
            }

            // If the parent category is being updated to a new Category, check that the user has permission to read the
            //   new Category, and then connect it. Only ID needs to be selected.
            let parentCategory = undefined;
            if (args.input.parent) {
                parentCategory = await ctx.prisma.category.findFirst({
                    where: {
                        AND: [
                            {id: parseInt(args.input.parent)},
                            getAccessibleByFilter(ctx.permissions, 'read').Category
                        ]
                    },
                    select: {id: true}
                });
                if(parentCategory === null) {
                    throw new Error("Insufficient permissions");
                }
                // Wrap parentCategory in prisma connect object.
                parentCategory = {connect: {id: parentCategory.id}};
            }

            // Create the Category and return it.
            return ctx.prisma.category.create({
                data: {
                    name: args.input.name,
                    priority: args.input.priority,
                    parent: parentCategory
                }
            });
        },
        updateCategory: async (parent, args, ctx: GraphQLContext): Promise<Category> => {
            // Get the requested Category in its current state.
            const category = await ctx.prisma.category.findFirst({
                where: {id: parseInt(args.id)}
            });
            // Check that this Category exists and the user is allowed to update it
            if (category === null || !canUpdate(ctx.permissions, subject("Category", category), category, args.input)) {
                throw new Error("Insufficient permissions");
            }
            // If the parent category is being updated to a new Category, check that the user has permission to read the
            //   new Category, and then connect it. Otherwise, if the parent category is being updated to null,
            //   disconnect it. Only ID needs to be selected.
            let parentCategory = undefined;
            if (args.input.parent) {
                parentCategory = await ctx.prisma.category.findFirst({
                    where: {
                        AND: [
                            {id: parseInt(args.input.parent)},
                            getAccessibleByFilter(ctx.permissions, 'read').Category
                        ]
                    },
                    select: {id: true}
                });
                if(parentCategory === null) {
                    throw new Error("Insufficient permissions");
                }
                // Wrap parentCategory in prisma connect object.
                parentCategory = {connect: {id: parentCategory.id}};
            }
            // Update the Category and return it.
            return ctx.prisma.category.update({
                where: {id: parseInt(args.id)},
                data: {
                    name: args.input.name,
                    priority: args.input.priority,
                    parent: parentCategory
                }
            });
        },
        deleteCategory: async (parent, args, ctx: GraphQLContext): Promise<Category> => {
            // Get the Category to delete, and check that the user has permission to delete it.
            const category = await ctx.prisma.category.findFirst({
                where: {
                    AND: [
                        getAccessibleByFilter(ctx.permissions, 'delete').Category,
                        {id: parseInt(args.id)}
                    ]
                }
            });
            // If null is returned, the Category doesn't exist or the user doesn't have permission to delete it.
            if (category === null) {
                throw new GraphQLYogaError('Insufficient permissions');
            }
            // Delete the Category.
            return await ctx.prisma.category.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    Category: {
        parent: async (parent, args, ctx: GraphQLContext): Promise<Category | null> => {
            // Get the requested Category, selecting the parent.
            const category = await ctx.prisma.category.findFirst({
                where: {id: parent.id},
                select: {parent: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (category === null) {
                throw new Error("Category is unexpectedly null");
            }
            // Return the parent.
            return category.parent;
        },
        children: async (parent, args, ctx: GraphQLContext): Promise<Category[]> => {
            // Get the requested Category, selecting the children.
            const category = await ctx.prisma.category.findFirst({
                where: {id: parent.id},
                select: {children: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (category === null) {
                throw new Error("Category is unexpectedly null");
            }
            // Return the children.
            return category.children;
        },
        productions: async (parent, args, ctx: GraphQLContext): Promise<Production[]> => {
            // Get the requested Category, selecting the productions.
            const category = await ctx.prisma.category.findFirst({
                where: {id: parent.id},
                select: {productions: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (category === null) {
                throw new Error("Category is unexpectedly null");
            }
            // Return the productions.
            return category.productions;
        }
    }
}
