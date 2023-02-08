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
import {FilterAssetInput} from "./dto/filter-asset.input";
import {Asset} from "./asset.entity";
import {UpdateAssetInput} from "./dto/update-asset.input";
import {CreateAssetInput} from "./dto/create-asset.input";
import {OrderAssetInput} from "./dto/order-asset.input";

@Resolver(() => Asset)
export class AssetResolver {
    private logger: Logger = new Logger("AssetResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Asset], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Asset)
    async findManyAsset(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAssetInput, nullable: true }) filter?: FilterAssetInput,
        @Args("order", { type: () => [OrderAssetInput], nullable: true }) order?: OrderAssetInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Asset[]> {
        this.logger.verbose("findManyAsset resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Asset, filter]
              }
            : accessibleBy(ctx.req.permissions).Asset;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.asset.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Asset, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Asset)
    async findOneAsset(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Asset> {
        this.logger.verbose("findOneAsset resolver called");
        return ctx.req.prismaTx.asset.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Asset]
            }
        });
    }

    @Mutation(() => Asset, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Asset)
    async createAsset(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateAssetInput }) input: CreateAssetInput
    ): Promise<Asset> {
        this.logger.verbose("createAsset resolver called");
        input = plainToClass(CreateAssetInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        return ctx.req.prismaTx.asset.create({
            data: input
        });
    }

    @Mutation(() => Asset, { complexity: Complexities.Update })
    @Rule(RuleType.Update, Asset)
    async updateAsset(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateAssetInput }) input: UpdateAssetInput
    ): Promise<Asset> {
        this.logger.verbose("updateAsset resolver called");
        input = plainToClass(UpdateAssetInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.asset.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Asset]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Asset not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Asset", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        return ctx.req.prismaTx.asset.update({
            where: {
                id
            },
            data: input
        });
    }

    @Mutation(() => Asset, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Asset)
    async deleteAsset(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Asset> {
        this.logger.verbose("deleteAsset resolver called");

        const rowToDelete = await ctx.req.prismaTx.asset.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Asset]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Asset not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Asset", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        return ctx.req.prismaTx.asset.delete({
            where: {
                id
            }
        });
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Asset)
    async assetCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAssetInput, nullable: true }) filter?: FilterAssetInput
    ): Promise<number> {
        return ctx.req.prismaTx.asset.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Asset, filter]
            }
        });
    }
}
