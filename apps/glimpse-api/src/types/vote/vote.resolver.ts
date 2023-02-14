import {Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Vote } from "./vote.entity";
import { FilterVoteInput } from "./dto/filter-vote.input";
import { OrderVoteInput } from "./dto/order-vote.input";
import { CreateVoteInput } from "./dto/create-vote.input";
import { UpdateVoteInput } from "./dto/update-vote.input";
import { VoteResponse } from "../vote_response/vote_response.entity";
import {FilterVoteResponseInput} from "../vote_response/dto/filter-vote_response.input";
import {OrderVoteResponseInput} from "../vote_response/dto/order-vote_response.input";

@Resolver(() => Vote)
export class VoteResolver {
    private logger: Logger = new Logger("VoteResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Vote], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Vote)")
    async findManyVote(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVoteInput, nullable: true }) filter?: FilterVoteInput,
        @Args("order", { type: () => [OrderVoteInput], nullable: true }) order?: OrderVoteInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Vote[]> {
        this.logger.verbose("findManyVote resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Vote, filter]
              }
            : accessibleBy(ctx.req.permissions).Vote;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.vote.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Vote, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Vote)")
    async findOneVote(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Vote> {
        this.logger.verbose("findOneVote resolver called");
        return ctx.req.prismaTx.vote.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Vote]
            }
        });
    }

    @Mutation(() => Vote, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Vote)")
    async createVote(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateVoteInput }) input: CreateVoteInput
    ): Promise<Vote> {
        this.logger.verbose("createVote resolver called");
        input = plainToClass(CreateVoteInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.vote.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Vote",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Vote, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Vote)")
    async updateVote(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateVoteInput }) input: UpdateVoteInput
    ): Promise<Vote> {
        this.logger.verbose("updateVote resolver called");
        input = plainToClass(UpdateVoteInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.vote.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Vote]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Vote not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Vote", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.vote.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Vote",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Vote, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Vote)")
    async deleteVote(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Vote> {
        this.logger.verbose("deleteVote resolver called");

        const rowToDelete = await ctx.req.prismaTx.vote.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Vote]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Vote not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Vote", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.vote.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Vote",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Vote)")
    async voteCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVoteInput, nullable: true }) filter?: FilterVoteInput
    ): Promise<number> {
        return ctx.req.prismaTx.vote.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for all VoteResponses which have this Vote as their {@link VoteResponse#voteId}.
     */
    @ResolveField(() => [VoteResponse], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: VoteResponse)")
    async responses(
        @Context() ctx: { req: Request },
        @Parent() vote: Vote,
        @Args("filter", { type: () => FilterVoteResponseInput, nullable: true }) filter?: FilterVoteResponseInput,
        @Args("order", { type: () => [OrderVoteResponseInput], nullable: true }) order?: OrderVoteResponseInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<VoteResponse[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (vote["responses"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).VoteResponse, { voteId: vote.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).VoteResponse, { voteId: vote.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.voteResponse.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }
}
