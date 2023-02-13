import {Resolver, Query, Mutation, Args, Int, Context, Directive} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { ProductionImage } from "./production_image.entity";
import { FilterProductionImageInput } from "./dto/filter-production_image.input";
import { CreateProductionImageInput } from "./dto/create-production_image.input";
import { UpdateProductionImageInput } from "./dto/update-production_image.input";

@Resolver(() => ProductionImage)
export class ProductionImageResolver {
    private logger: Logger = new Logger("ProductionImageResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => ProductionImage, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: ProductionImage)")
    async findOneProductionImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<ProductionImage> {
        this.logger.verbose("findOneProductionImage resolver called");
        return ctx.req.prismaTx.productionImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionImage]
            }
        });
    }

    @Mutation(() => ProductionImage, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: ProductionImage)")
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
    @Directive("@rule(ruleType: Update, subject: ProductionImage)")
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
    @Directive("@rule(ruleType: Delete, subject: ProductionImage)")
    async deleteProductionImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<ProductionImage> {
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
    @Directive("@rule(ruleType: Count, subject: ProductionImage)")
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
