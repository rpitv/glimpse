import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { ContactSubmission } from "./contact_submission.entity";
import { FilterContactSubmissionInput } from "./dto/filter-contact_submission.input";
import { OrderContactSubmissionInput } from "./dto/order-contact_submission.input";
import { CreateContactSubmissionInput } from "./dto/create-contact_submission.input";
import { UpdateContactSubmissionInput } from "./dto/update-contact_submission.input";
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";
import * as process from "process";

@Resolver(() => ContactSubmission)
export class ContactSubmissionResolver {
    private logger: Logger = new Logger("ContactSubmissionResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ContactSubmission], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, ContactSubmission)
    async findManyContactSubmission(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterContactSubmissionInput, nullable: true })
        filter?: FilterContactSubmissionInput,
        @Args("order", { type: () => [OrderContactSubmissionInput], nullable: true })
        order?: OrderContactSubmissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ContactSubmission[]> {
        this.logger.verbose("findManyContactSubmission resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ContactSubmission, filter]
              }
            : accessibleBy(ctx.req.permissions).ContactSubmission;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.contactSubmission.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => ContactSubmission, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, ContactSubmission)
    async findOneContactSubmission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ContactSubmission> {
        this.logger.verbose("findOneContactSubmission resolver called");
        return ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Create })
    @Rule(RuleType.Create, ContactSubmission)
    async createContactSubmission(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateContactSubmissionInput }) input: CreateContactSubmissionInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("createContactSubmission resolver called");
        input = plainToClass(CreateContactSubmissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.contactSubmission.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ContactSubmission)
    async updateContactSubmission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateContactSubmissionInput }) input: UpdateContactSubmissionInput
    ): Promise<ContactSubmission> {
        this.logger.verbose("updateContactSubmission resolver called");
        input = plainToClass(UpdateContactSubmissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("ContactSubmission not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("ContactSubmission", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.contactSubmission.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ContactSubmission, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, ContactSubmission)
    async deleteContactSubmission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ContactSubmission> {
        this.logger.verbose("deleteContactSubmission resolver called");

        const rowToDelete = await ctx.req.prismaTx.contactSubmission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ContactSubmission]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ContactSubmission not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ContactSubmission", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.contactSubmission.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ContactSubmission",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, ContactSubmission)
    async contactSubmissionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterContactSubmissionInput, nullable: true })
        filter?: FilterContactSubmissionInput
    ): Promise<number> {
        return ctx.req.prismaTx.contactSubmission.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ContactSubmission, filter]
            }
        });
    }
}
