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
import { Redirect } from "./redirect.entity";
import { FilterRedirectInput } from "./dto/filter-redirect.input";
import { OrderRedirectInput } from "./dto/order-redirect.input";
import { CreateRedirectInput } from "./dto/create-redirect.input";
import { UpdateRedirectInput } from "./dto/update-redirect.input";

@Resolver(() => Redirect)
export class RedirectResolver {
    private logger: Logger = new Logger("RedirectResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Redirect], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Redirect)
    async findManyRedirect(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterRedirectInput, nullable: true }) filter?: FilterRedirectInput,
        @Args("order", { type: () => [OrderRedirectInput], nullable: true }) order?: OrderRedirectInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Redirect[]> {
        this.logger.verbose("findManyRedirect resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Redirect, filter]
              }
            : accessibleBy(ctx.req.permissions).Redirect;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.redirect.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Redirect, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Redirect)
    async findOneRedirect(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Redirect> {
        this.logger.verbose("findOneRedirect resolver called");
        return ctx.req.prismaTx.redirect.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Redirect]
            }
        });
    }

    @Mutation(() => Redirect, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Redirect)
    async createRedirect(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateRedirectInput }) input: CreateRedirectInput
    ): Promise<Redirect> {
        this.logger.verbose("createRedirect resolver called");
        input = plainToClass(CreateRedirectInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.redirect.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Redirect",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Redirect, { complexity: Complexities.Update })
    @Rule(RuleType.Update, Redirect)
    async updateRedirect(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateRedirectInput }) input: UpdateRedirectInput
    ): Promise<Redirect> {
        this.logger.verbose("updateRedirect resolver called");
        input = plainToClass(UpdateRedirectInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.redirect.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Redirect]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Redirect not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Redirect", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.redirect.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Redirect",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Redirect, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Redirect)
    async deleteRedirect(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Redirect> {
        this.logger.verbose("deleteRedirect resolver called");

        const rowToDelete = await ctx.req.prismaTx.redirect.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Redirect]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Redirect not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Redirect", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.redirect.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Redirect",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Redirect)
    async redirectCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterRedirectInput, nullable: true }) filter?: FilterRedirectInput
    ): Promise<number> {
        return ctx.req.prismaTx.redirect.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }
}
