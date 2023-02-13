import { Resolver, Query, Mutation, Args, Int, Context, Directive } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Production } from "./production.entity";
import { FilterProductionInput } from "./dto/filter-production.input";
import { OrderProductionInput } from "./dto/order-production.input";
import { CreateProductionInput } from "./dto/create-production.input";
import { UpdateProductionInput } from "./dto/update-production.input";

@Resolver(() => Production)
export class ProductionResolver {
    private logger: Logger = new Logger("ProductionResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Production], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Production)")
    async findManyProduction(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput,
        @Args("order", { type: () => [OrderProductionInput], nullable: true }) order?: OrderProductionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Production[]> {
        this.logger.verbose("findManyProduction resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Production, filter]
              }
            : accessibleBy(ctx.req.permissions).Production;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.production.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Production, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Production)")
    async findOneProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Production> {
        this.logger.verbose("findOneProduction resolver called");
        return ctx.req.prismaTx.production.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Production]
            }
        });
    }

    @Mutation(() => Production, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Production)")
    async createProduction(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionInput }) input: CreateProductionInput
    ): Promise<Production> {
        this.logger.verbose("createProduction resolver called");
        input = plainToClass(CreateProductionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.production.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Production, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Production)")
    async updateProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateProductionInput }) input: UpdateProductionInput
    ): Promise<Production> {
        this.logger.verbose("updateProduction resolver called");
        input = plainToClass(UpdateProductionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.production.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Production]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Production", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.production.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Production, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Production)")
    async deleteProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Production> {
        this.logger.verbose("deleteProduction resolver called");

        const rowToDelete = await ctx.req.prismaTx.production.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Production]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Production not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Production", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.production.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Production",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Production)")
    async productionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput
    ): Promise<number> {
        return ctx.req.prismaTx.production.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Production, filter]
            }
        });
    }
}
