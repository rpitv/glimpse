import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { VoteResponse } from "./vote_response.entity";
import { FilterVoteResponseInput } from "./dto/filter-vote_response.input";
import { OrderVoteResponseInput } from "./dto/order-vote_response.input";
import { CreateVoteResponseInput } from "./dto/create-vote_response.input";
import { UpdateVoteResponseInput } from "./dto/update-vote_response.input";

@Resolver(() => VoteResponse)
export class VoteResponseResolver {
    private logger: Logger = new Logger("VoteResponseResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [VoteResponse], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, VoteResponse)
    async findManyVoteResponse(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVoteResponseInput, nullable: true }) filter?: FilterVoteResponseInput,
        @Args("order", { type: () => [OrderVoteResponseInput], nullable: true }) order?: OrderVoteResponseInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<VoteResponse[]> {
        this.logger.verbose("findManyVoteResponse resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).VoteResponse, filter]
              }
            : accessibleBy(ctx.req.permissions).VoteResponse;

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

    @Query(() => VoteResponse, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, VoteResponse)
    async findOneVoteResponse(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<VoteResponse> {
        this.logger.verbose("findOneVoteResponse resolver called");
        return ctx.req.prismaTx.voteResponse.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).VoteResponse]
            }
        });
    }

    @Mutation(() => VoteResponse, { complexity: Complexities.Create })
    @Rule(RuleType.Create, VoteResponse)
    async createVoteResponse(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateVoteResponseInput }) input: CreateVoteResponseInput
    ): Promise<VoteResponse> {
        this.logger.verbose("createVoteResponse resolver called");
        input = plainToClass(CreateVoteResponseInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.voteResponse.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "VoteResponse",
            id: result.id
        });

        return result;
    }

    @Mutation(() => VoteResponse, { complexity: Complexities.Update })
    @Rule(RuleType.Update, VoteResponse)
    async updateVoteResponse(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateVoteResponseInput }) input: UpdateVoteResponseInput
    ): Promise<VoteResponse> {
        this.logger.verbose("updateVoteResponse resolver called");
        input = plainToClass(UpdateVoteResponseInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.voteResponse.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).VoteResponse]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("VoteResponse not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("VoteResponse", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.voteResponse.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "VoteResponse",
            id: result.id
        });

        return result;
    }

    @Mutation(() => VoteResponse, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, VoteResponse)
    async deleteVoteResponse(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<VoteResponse> {
        this.logger.verbose("deleteVoteResponse resolver called");

        const rowToDelete = await ctx.req.prismaTx.voteResponse.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).VoteResponse]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("VoteResponse not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("VoteResponse", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.voteResponse.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "VoteResponse",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, VoteResponse)
    async voteResponseCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVoteResponseInput, nullable: true }) filter?: FilterVoteResponseInput
    ): Promise<number> {
        return ctx.req.prismaTx.voteResponse.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).VoteResponse, filter]
            }
        });
    }
}