import { Resolver, Query, Mutation, Args, Int, Context, ResolveField, Parent, Directive, ID } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { FilterAssetInput } from "./dto/filter-asset.input";
import { Asset } from "./asset.entity";
import { UpdateAssetInput } from "./dto/update-asset.input";
import { CreateAssetInput } from "./dto/create-asset.input";
import { OrderAssetInput } from "./dto/order-asset.input";
import { User } from "../user/user.entity";

@Resolver(() => Asset)
export class AssetResolver {
    private logger: Logger = new Logger("AssetResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Asset], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Asset)")
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => Asset, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Asset)")
    async findOneAsset(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<Asset> {
        this.logger.verbose("findOneAsset resolver called");
        return ctx.req.prismaTx.asset.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Asset]
            }
        });
    }

    @Mutation(() => Asset, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Asset)")
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

        const result = await ctx.req.prismaTx.asset.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Asset",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Asset, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Asset)")
    async updateAsset(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
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

        const result = await ctx.req.prismaTx.asset.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Asset",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Asset, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Asset)")
    async deleteAsset(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<Asset> {
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

        const result = await ctx.req.prismaTx.asset.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Asset",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Asset)")
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

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the User corresponding to the Asset's {@link Asset#lastKnownHandlerId}.
     */
    @ResolveField(() => User, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: User)")
    async lastKnownHandler(@Context() ctx: { req: Request }, @Parent() asset: Asset): Promise<User> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!asset.lastKnownHandlerId || asset["lastKnownHandler"] === null) {
            return null;
        }
        return ctx.req.prismaTx.user.findFirst({
            where: { id: asset.lastKnownHandlerId }
        });
    }

    /**
     * Virtual field resolver for the Asset corresponding to the Asset's {@link Asset#parentId}.
     */
    @ResolveField(() => Asset, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Asset)")
    async parent(@Context() ctx: { req: Request }, @Parent() asset: Asset): Promise<Asset> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!asset.parentId || asset["parent"] === null) {
            return null;
        }
        return ctx.req.prismaTx.asset.findFirst({
            where: { id: asset.parentId }
        });
    }

    /**
     * Virtual field resolver for all Assets which have this Asset as their {@link Asset#parentId}.
     */
    @ResolveField(() => [Asset], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Asset)")
    async children(
        @Context() ctx: { req: Request },
        @Parent() asset: Asset,
        @Args("filter", { type: () => FilterAssetInput, nullable: true }) filter?: FilterAssetInput,
        @Args("order", { type: () => [OrderAssetInput], nullable: true }) order?: OrderAssetInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Asset[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (asset["children"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Asset, { parentId: asset.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Asset, { parentId: asset.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.asset.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }
}
