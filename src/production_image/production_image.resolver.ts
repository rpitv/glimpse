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
import { ProductionImage } from "./production_image.entity";
import { FilterProductionImageInput } from "./dto/filter-production_image.input";
import { OrderProductionImageInput } from "./dto/order-production_image.input";
import { CreateProductionImageInput } from "./dto/create-production_image.input";
import { UpdateProductionImageInput } from "./dto/update-production_image.input";

@Resolver(() => ProductionImage)
export class ProductionImageResolver {
    private logger: Logger = new Logger("ProductionImageResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ProductionImage], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, ProductionImage)
    async findManyProductionImage(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionImageInput, nullable: true }) filter?: FilterProductionImageInput,
        @Args("order", { type: () => [OrderProductionImageInput], nullable: true }) order?: OrderProductionImageInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionImage[]> {
        this.logger.verbose("findManyProductionImage resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ProductionImage, filter]
              }
            : accessibleBy(ctx.req.permissions).ProductionImage;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.productionImage.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => ProductionImage, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, ProductionImage)
    async findOneProductionImage(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<ProductionImage> {
        this.logger.verbose("findOneProductionImage resolver called");
        return ctx.req.prismaTx.productionImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionImage]
            }
        });
    }

    @Mutation(() => ProductionImage, { complexity: Complexities.Create })
    @Rule(RuleType.Create, ProductionImage)
    async createProductionImage(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionImageInput }) input: CreateProductionImageInput
    ): Promise<ProductionImage> {
        this.logger.verbose("createProductionImage resolver called");
        input = plainToClass(CreateProductionImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.productionImage.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ProductionImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionImage, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ProductionImage)
    async updateProductionImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateProductionImageInput }) input: UpdateProductionImageInput
    ): Promise<ProductionImage> {
        this.logger.verbose("updateProductionImage resolver called");
        input = plainToClass(UpdateProductionImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.productionImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionImage]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("ProductionImage not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("ProductionImage", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.productionImage.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ProductionImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionImage, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, ProductionImage)
    async deleteProductionImage(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<ProductionImage> {
        this.logger.verbose("deleteProductionImage resolver called");

        const rowToDelete = await ctx.req.prismaTx.productionImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionImage]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ProductionImage not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ProductionImage", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.productionImage.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ProductionImage",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, ProductionImage)
    async productionImageCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionImageInput, nullable: true }) filter?: FilterProductionImageInput
    ): Promise<number> {
        return ctx.req.prismaTx.productionImage.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ProductionImage, filter]
            }
        });
    }
}
