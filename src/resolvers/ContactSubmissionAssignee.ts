import {Resolvers} from "../generated/graphql";
import {GraphQLContext} from "custom";
import {ContactSubmission, ContactSubmissionAssignee, User } from "@prisma/client";
import {subject} from "@casl/ability";
import {constructPagination, getAccessibleByFilter} from "../utils";
import {GraphQLYogaError} from "@graphql-yoga/node";

export const resolver: Resolvers = {
    Query: {
        contactSubmissionAssignees: async (parent, args, ctx: GraphQLContext):
                Promise<ContactSubmissionAssignee[]> => {
            // Construct pagination. If user is using cursor-based pagination, then make sure they have permission to
            //   read the ContactSubmissionAssignee at the cursor. If not, return empty array, as if the
            //   ContactSubmissionAssignee didn't exist.
            const pagination = constructPagination(args);
            if (pagination.cursor) {
                const contactSubmissionAssignee = await ctx.prisma.contactSubmissionAssignee.findFirst({
                    where: {id: pagination.cursor.id}
                });
                if (contactSubmissionAssignee === null || !ctx.permissions.can('read',
                        subject("ContactSubmissionAssignee", contactSubmissionAssignee), "id")) {
                    return [];
                }
            }

            // Get the ContactSubmissionAssignees that the user has permission to read, and inject pagination object.
            return ctx.prisma.contactSubmissionAssignee.findMany({
                where: getAccessibleByFilter(ctx.permissions, 'read').ContactSubmissionAssignee,
                ...pagination
            });
        },
        contactSubmissionAssignee: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmissionAssignee | null> => {
            // Return the ContactSubmissionAssignee that matches the passed ID and is allowed by the users permission
            // levels.
            return await ctx.prisma.contactSubmissionAssignee.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.id)},
                        getAccessibleByFilter(ctx.permissions, 'read').ContactSubmissionAssignee
                    ]
                },
            });
        }
    },
    Mutation: {
        createContactSubmissionAssignee: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmissionAssignee> => {
            // Check that user is allowed to create the passed ContactSubmissionAssignee. Fields aren't relevant in this
            //   context.
            if (!ctx.permissions.can('create', subject("ContactSubmissionAssignee", args.input))) {
                throw new Error("Insufficient permissions");
            }

            // Check that the user has permission to read the User with the ID matching user, and then connect it.
            //   Only ID needs to be selected.
            const user = await ctx.prisma.user.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.input.user)},
                        getAccessibleByFilter(ctx.permissions, 'read').User
                    ]
                },
                select: {id: true}
            });
            if(user === null) {
                throw new Error("User not found");
            }

            // Check that the user has permission to read the ContactSubmission with the ID matching contactSubmission, and then connect it.
            //   Only ID needs to be selected.
            const contactSubmission = await ctx.prisma.contactSubmission.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.input.submission)},
                        getAccessibleByFilter(ctx.permissions, 'read').ContactSubmission
                    ]
                },
                select: {id: true}
            });
            if(contactSubmission === null) {
                throw new Error("ContactSubmission not found");
            }

            // Create the ContactSubmissionAssignee.
            return ctx.prisma.contactSubmissionAssignee.create({
                data: {
                    user: {connect: {id: user.id}},
                    submission: {connect: {id: contactSubmission.id}}
                }
            });
        },
        deleteContactSubmissionAssignee: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmissionAssignee> => {
            // Get the ContactSubmissionAssignee to delete, and check that the user has permission to delete it.
            const contactSubmissionAssignee = await ctx.prisma.contactSubmissionAssignee.findFirst({
                where: {
                    AND: [
                        {id: parseInt(args.id)},
                        getAccessibleByFilter(ctx.permissions, 'delete').ContactSubmissionAssignee
                    ]
                }
            });
            // If null is returned, the ContactSubmissionAssignee doesn't exist or the user doesn't have permission to
            //   delete it.
            if (contactSubmissionAssignee === null) {
                throw new GraphQLYogaError("Insufficient permissions");
            }
            // Delete the ContactSubmissionAssignee.
            return ctx.prisma.contactSubmissionAssignee.delete({
                where: {id: parseInt(args.id)}
            });
        }
    },
    ContactSubmissionAssignee: {
        submission: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission> => {
            // Get the requested ContactSubmissionAssignee, selecting the parent.
            const contactSubmissionAssignee = await ctx.prisma.contactSubmissionAssignee.findFirst({
                where: {id: parent.id},
                select: {submission: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (contactSubmissionAssignee === null) {
                throw new Error("ContactSubmissionAssignee is unexpectedly null");
            }
            // Return the submission.
            return contactSubmissionAssignee.submission;
        },
        user: async (parent, args, ctx: GraphQLContext): Promise<User> => {
            // Get the requested ContactSubmissionAssignee, selecting the parent.
            const contactSubmissionAssignee = await ctx.prisma.contactSubmissionAssignee.findFirst({
                where: {id: parent.id},
                select: {user: true}
            });
            // This should never happen since the parent resolver would have returned null.
            if (contactSubmissionAssignee === null) {
                throw new Error("ContactSubmissionAssignee is unexpectedly null");
            }
            // Return the user.
            return contactSubmissionAssignee.user;
        }
    }
}
