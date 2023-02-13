import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rule.decorator";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Category } from "./category.entity";
import { FilterCategoryInput } from "./dto/filter-category.input";
import { OrderCategoryInput } from "./dto/order-category.input";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";

@Resolver(() => Category)
export class CategoryResolver {
    private logger: Logger = new Logger("CategoryResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Category], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Category)
    async findManyCategory(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterCategoryInput, nullable: true }) filter?: FilterCategoryInput,
        @Args("order", { type: () => [OrderCategoryInput], nullable: true }) order?: OrderCategoryInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Category[]> {
        this.logger.verbose("findManyCategory resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Category, filter]
              }
            : accessibleBy(ctx.req.permissions).Category;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.category.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Category, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Category)
    async findOneCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Category> {
        this.logger.verbose("findOneCategory resolver called");
        return ctx.req.prismaTx.category.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Category]
            }
        });
    }

    @Mutation(() => Category, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Category)
    async createCategory(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateCategoryInput }) input: CreateCategoryInput
    ): Promise<Category> {
        this.logger.verbose("createCategory resolver called");
        input = plainToClass(CreateCategoryInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.category.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Category",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Category, { complexity: Complexities.Update })
    @Rule(RuleType.Update, Category)
    async updateCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateCategoryInput }) input: UpdateCategoryInput
    ): Promise<Category> {
        this.logger.verbose("updateCategory resolver called");
        input = plainToClass(UpdateCategoryInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.category.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Category]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Category not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Category", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.category.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Category",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Category, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Category)
    async deleteCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Category> {
        this.logger.verbose("deleteCategory resolver called");

        const rowToDelete = await ctx.req.prismaTx.category.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Category]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Category not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Category", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.category.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Category",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Category)
    async categoryCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterCategoryInput, nullable: true }) filter?: FilterCategoryInput
    ): Promise<number> {
        return ctx.req.prismaTx.category.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Category, filter]
            }
        });
    }
}
