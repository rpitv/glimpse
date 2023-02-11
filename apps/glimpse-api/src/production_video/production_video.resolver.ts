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
import { ProductionVideo } from "./production_video.entity";
import { FilterProductionVideoInput } from "./dto/filter-production_video.input";
import { OrderProductionVideoInput } from "./dto/order-production_video.input";
import { CreateProductionVideoInput } from "./dto/create-production_video.input";
import { UpdateProductionVideoInput } from "./dto/update-production_video.input";

@Resolver(() => ProductionVideo)
export class ProductionVideoResolver {
    private logger: Logger = new Logger("ProductionVideoResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ProductionVideo], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, ProductionVideo)
    async findManyProductionVideo(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionVideoInput, nullable: true }) filter?: FilterProductionVideoInput,
        @Args("order", { type: () => [OrderProductionVideoInput], nullable: true }) order?: OrderProductionVideoInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionVideo[]> {
        this.logger.verbose("findManyProductionVideo resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ProductionVideo, filter]
              }
            : accessibleBy(ctx.req.permissions).ProductionVideo;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.productionVideo.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => ProductionVideo, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, ProductionVideo)
    async findOneProductionVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<ProductionVideo> {
        this.logger.verbose("findOneProductionVideo resolver called");
        return ctx.req.prismaTx.productionVideo.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionVideo]
            }
        });
    }

    @Mutation(() => ProductionVideo, { complexity: Complexities.Create })
    @Rule(RuleType.Create, ProductionVideo)
    async createProductionVideo(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionVideoInput }) input: CreateProductionVideoInput
    ): Promise<ProductionVideo> {
        this.logger.verbose("createProductionVideo resolver called");
        input = plainToClass(CreateProductionVideoInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.productionVideo.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ProductionVideo",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionVideo, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ProductionVideo)
    async updateProductionVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateProductionVideoInput }) input: UpdateProductionVideoInput
    ): Promise<ProductionVideo> {
        this.logger.verbose("updateProductionVideo resolver called");
        input = plainToClass(UpdateProductionVideoInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.productionVideo.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionVideo]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("ProductionVideo not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("ProductionVideo", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.productionVideo.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ProductionVideo",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionVideo, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, ProductionVideo)
    async deleteProductionVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<ProductionVideo> {
        this.logger.verbose("deleteProductionVideo resolver called");

        const rowToDelete = await ctx.req.prismaTx.productionVideo.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionVideo]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ProductionVideo not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ProductionVideo", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.productionVideo.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ProductionVideo",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, ProductionVideo)
    async productionVideoCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionVideoInput, nullable: true }) filter?: FilterProductionVideoInput
    ): Promise<number> {
        return ctx.req.prismaTx.productionVideo.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ProductionVideo, filter]
            }
        });
    }
}