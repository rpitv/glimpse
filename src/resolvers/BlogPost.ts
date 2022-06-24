import {Resolvers} from "../generated/graphql";
import {GraphQLContext} from "custom";
import {BlogPost, Person} from "@prisma/client";
import {constructPagination} from "../utils";
import {subject} from "@casl/ability";
import {accessibleBy} from "@casl/prisma";
import {GraphQLYogaError} from "@graphql-yoga/node";
import {canUpdate} from "../permissions";

export const resolver: Resolvers = {
    Query: {
        blogPosts: async (parent, args, ctx: GraphQLContext): Promise<BlogPost[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the BlogPost at the cursor. If not, return empty array, as if the BlogPost didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const blogPost = await ctx.prisma.blogPost.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (blogPost === null || !ctx.permissions.can('read', subject("BlogPost", blogPost), "id")) {
                    return [];
                }
            }

            // Get the BlogPosts that the user has permission to read, and inject pagination object.
            return ctx.prisma.blogPost.findMany({
                where: accessibleBy(ctx.permissions, 'read').BlogPost,
                ...pagination
            });
        },
        blogPost: async (parent, args, ctx: GraphQLContext): Promise<BlogPost | null> => {
            // Return the BlogPost that matches the passed ID and is allowed by the users permission levels.
            return await ctx.prisma.blogPost.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.id)},
                        accessibleBy(ctx.permissions, 'read').BlogPost
                    ]
                },
            });
        }
    },
    Mutation: {
        createBlogPost: async (parent, args, ctx: GraphQLContext): Promise<BlogPost> => {
            // Check that user is allowed to create the passed BlogPost. Fields aren't relevant in this context.
            if (!ctx.permissions.can('create', subject("BlogPost", args.input))) {
                throw new Error("Insufficient permissions");
            }

            // Check that the user has permission to read the Person with the ID matching author, and then connect it.
            //   Only ID needs to be selected.
            const author = await ctx.prisma.person.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.input.author)},
                        accessibleBy(ctx.permissions, 'read').Person
                    ]
                },
                select: {id: true}
            });
            if(author === null) {
                throw new GraphQLYogaError("Insufficient permissions");
            }

            // Create the BlogPost and return it.
            return await ctx.prisma.blogPost.create({
                data: {
                    content: args.input.content,
                    title: args.input.title,
                    author: {connect: author},
                    authorDisplayName: args.input.authorDisplayName,
                }
            });
        },
        updateBlogPost: async (parent, args, ctx: GraphQLContext): Promise<BlogPost> => {
            // Get the requested BlogPost in its current state.
            const blogPost = await ctx.prisma.blogPost.findFirst({
                where: {id: parseInt(args.id)},
            });
            // Check that BlogPost exists and user has permission to update it.
            if (blogPost === null || !canUpdate(ctx.permissions, "BlogPost", blogPost, args.input)) {
                throw new GraphQLYogaError("Insufficient permissions");
            }

            // If the author is specified, check that the user has permission to read the Person with the matching ID,
            //   and then connect it. Only ID needs to be selected.
            let author = undefined;
            if (args.input.author) {
                author = await ctx.prisma.person.findFirst({
                    where: {
                        AND: [
                            {id: parseInt(args.input.author)},
                            accessibleBy(ctx.permissions, 'read').Person
                        ]
                    },
                    select: {id: true}
                });
                if (author === null) {
                    throw new GraphQLYogaError("Insufficient permissions");
                }
                // Wrap the author in a Prisma connect object
                author = {connect: author};
            }

            // Update the BlogPost and return it.
            return await ctx.prisma.blogPost.update({
                where: {id: parseInt(args.id)},
                data: {
                    content: args.input.content,
                    title: args.input.title,
                    authorDisplayName: args.input.authorDisplayName,
                    author
                }
            });
        },
        deleteBlogPost: async (parent, args, ctx: GraphQLContext): Promise<BlogPost> => {
            // Get the BlogPost to delete, and check that the user has permission to delete it.
            const blogPost = await ctx.prisma.blogPost.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.id)},
                        accessibleBy(ctx.permissions, 'delete').BlogPost
                    ]
                }
            });
            // If null is returned, then the BlogPost doesn't exist or the user doesn't have permission to delete it.
            if (blogPost === null) {
                throw new GraphQLYogaError("Insufficient permissions");
            }
            // Delete the BlogPost and return it.
            return await ctx.prisma.blogPost.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    BlogPost: {
        author: async (parent, args, ctx: GraphQLContext): Promise<Person> => {
            // Get the requested BlogPost, selecting only the author.
            const blogPost = await ctx.prisma.blogPost.findFirst({
                where: {id: parent.id},
                select: {author: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (blogPost === null) {
                throw new GraphQLYogaError("BlogPost is unexpectedly null");
            }
            // Return the author of the BlogPost.
            return blogPost.author;
        }
    }
}
