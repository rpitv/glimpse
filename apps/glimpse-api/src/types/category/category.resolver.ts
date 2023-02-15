import {Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent, ID} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Category } from "./category.entity";
import { FilterCategoryInput } from "./dto/filter-category.input";
import { OrderCategoryInput } from "./dto/order-category.input";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { Production } from "../production/production.entity";
import { FilterProductionInput } from "../production/dto/filter-production.input";
import { OrderProductionInput } from "../production/dto/order-production.input";

@Resolver(() => Category)
export class CategoryResolver {
    private logger: Logger = new Logger("CategoryResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Category], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Category)")
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
    @Directive("@rule(ruleType: ReadOne, subject: Category)")
    async findOneCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
    ): Promise<Category> {
        this.logger.verbose("findOneCategory resolver called");
        return ctx.req.prismaTx.category.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Category]
            }
        });
    }

    @Mutation(() => Category, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Category)")
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
    @Directive("@rule(ruleType: Update, subject: Category)")
    async updateCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
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
    @Directive("@rule(ruleType: Delete, subject: Category)")
    async deleteCategory(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
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
    @Directive("@rule(ruleType: Count, subject: Category)")
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

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Category corresponding to the Category's {@link Category#parentId}.
     */
    @ResolveField(() => Category, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Category)")
    async parent(@Context() ctx: { req: Request }, @Parent() category: Category): Promise<Category> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!category.parentId || category["parent"] === null) {
            return null;
        }
        return ctx.req.prismaTx.category.findFirst({
            where: { id: category.parentId }
        });
    }

    /**
     * Virtual field resolver for all Categories which have this Category as their {@link Category#parentId}.
     */
    @ResolveField(() => [Category], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Category)")
    async children(
        @Context() ctx: { req: Request },
        @Parent() category: Category,
        @Args("filter", { type: () => FilterCategoryInput, nullable: true }) filter?: FilterCategoryInput,
        @Args("order", { type: () => [OrderCategoryInput], nullable: true }) order?: OrderCategoryInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Category[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (category["children"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Category, { parentId: category.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Category, { parentId: category.id }] };

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

    /**
     * Virtual field resolver for all Productions which have this Category as their {@link Production#categoryId}.
     */
    @ResolveField(() => [Production], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Production)")
    async productions(
        @Context() ctx: { req: Request },
        @Parent() category: Category,
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput,
        @Args("order", { type: () => [OrderProductionInput], nullable: true }) order?: OrderProductionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Production[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (category["productions"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Production, { categoryId: category.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Production, { categoryId: category.id }] };

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
}
