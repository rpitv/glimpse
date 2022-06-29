import {Resolvers} from "../generated/graphql";
import {ContactSubmission, ContactSubmissionAssignee} from "@prisma/client";
import {GraphQLContext} from "custom";

const resolvers: Resolvers = {
    // Query: {
    //     contactSubmissions: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission[]> => {
    //
    //     },
    //     contactSubmission: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission | null> => {
    //
    //     }
    // },
    // Mutation: {
    //     createContactSubmission: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission> => {
    //
    //     },
    //     updateContactSubmission: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission> => {
    //
    //     },
    //     deleteContactSubmission: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmission> => {
    //
    //     }
    // },
    // ContactSubmission: {
    //     assignees: async (parent, args, ctx: GraphQLContext): Promise<ContactSubmissionAssignee[]> => {
    //
    //     }
    // }
}
