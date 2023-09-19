import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { Production } from "./production.entity";
import { FilterProductionInput } from "./dto/filter-production.input";
import { OrderProductionInput } from "./dto/order-production.input";
import { CreateProductionInput } from "./dto/create-production.input";
import { UpdateProductionInput } from "./dto/update-production.input";
import { Category } from "../category/category.entity";
import { Image } from "../image/image.entity";
import { Credit } from "../credit/credit.entity";
import { FilterCreditInput } from "../credit/dto/filter-credit.input";
import { OrderCreditInput } from "../credit/dto/order-credit.input";
import { ProductionImage } from "../production_image/production_image.entity";
import { FilterProductionImageInput } from "../production_image/dto/filter-production_image.input";
import { ProductionVideo } from "../production_video/production_video.entity";
import { FilterProductionVideoInput } from "../production_video/dto/filter-production_video.input";
import { ProductionRSVP } from "../production_rsvp/production_rsvp.entity";
import { FilterProductionRSVPInput } from "../production_rsvp/dto/filter-production_rsvp.input";
import { OrderProductionRSVPInput } from "../production_rsvp/dto/order-production_rsvp.input";
import { ProductionTag } from "../production_tag/production_tag.entity";
import { FilterProductionTagInput } from "../production_tag/dto/filter-production_tag.input";
import { OrderProductionTagInput } from "../production_tag/dto/order-production_tag.input";
import { GraphQLBigInt } from "graphql-scalars";
import { OrderProductionVideoInput } from "../production_video/dto/order-production_video.input";
import { OrderProductionImageInput } from "../production_image/dto/order-production_image.input";
import { Rule, RuleType } from "../../casl/rule.decorator";
import { ProductionService } from "./production.service";

@Resolver(() => Production)
export class ProductionResolver {
    private logger: Logger = new Logger("ProductionResolver");
    constructor(private readonly productionService: ProductionService) {}

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Production], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Production)
    async findManyProduction(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput,
        @Args("order", { type: () => [OrderProductionInput], nullable: true }) order?: OrderProductionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Production[]> {
        this.logger.verbose("findManyProduction resolver called");
        return this.productionService.findManyProduction(ctx.req.prismaTx, { filter, order, pagination }, ctx);
    }

    @Query(() => Production, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Production)
    async findOneProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Production> {
        this.logger.verbose("findOneProduction resolver called");
        return this.productionService.findOneProduction(id, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => Production, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Production)
    async createProduction(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionInput }) input: CreateProductionInput
    ): Promise<Production> {
        this.logger.verbose("createProduction resolver called");
        return this.productionService.createProduction(input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => Production, { complexity: Complexities.Update })
    @Rule(RuleType.Update, Production)
    async updateProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateProductionInput }) input: UpdateProductionInput
    ): Promise<Production> {
        this.logger.verbose("updateProduction resolver called");
        return this.productionService.updateProduction(id, input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => Production, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Production)
    async deleteProduction(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Production> {
        this.logger.verbose("deleteProduction resolver called");
        return this.productionService.deleteProduction(id, ctx.req.prismaTx, ctx);
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Production)
    async productionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput
    ): Promise<number> {
        this.logger.verbose("productionCount resolver called");
        return this.productionService.productionCount(ctx.req.prismaTx, { filter }, ctx);
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Category corresponding to the Production's {@link Production#categoryId}.
     */
    @ResolveField(() => Category, { nullable: true })
    @Rule(RuleType.ReadOne, Category)
    async category(@Context() ctx: { req: Request }, @Parent() production: Production): Promise<Category> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!production.categoryId || production["category"] === null) {
            return null;
        }
        return ctx.req.prismaTx.category.findFirst({
            where: { id: production.categoryId }
        });
    }

    /**
     * Virtual field resolver for the Image corresponding to the Production's {@link Production#thumbnailId}.
     */
    @ResolveField(() => Image, { nullable: true })
    @Rule(RuleType.ReadOne, Image)
    async thumbnail(@Context() ctx: { req: Request }, @Parent() production: Production): Promise<Image> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!production.thumbnailId || production["thumbnail"] === null) {
            return null;
        }
        return ctx.req.prismaTx.image.findFirst({
            where: { id: production.thumbnailId }
        });
    }

    /**
     * Virtual field resolver for all Credits which have this Production as their {@link Credit#productionId}.
     */
    @ResolveField(() => [Credit], { nullable: true })
    @Rule(RuleType.ReadMany, Credit)
    async credits(
        @Context() ctx: { req: Request },
        @Parent() production: Production,
        @Args("filter", { type: () => FilterCreditInput, nullable: true }) filter?: FilterCreditInput,
        @Args("order", { type: () => [OrderCreditInput], nullable: true }) order?: OrderCreditInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Credit[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (production["credits"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Credit, { productionId: production.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Credit, { productionId: production.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.credit.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionImages which have this Production as their {@link ProductionImage#productionId}.
     */
    @ResolveField(() => [ProductionImage], { nullable: true })
    @Rule(RuleType.ReadMany, ProductionImage)
    async images(
        @Context() ctx: { req: Request },
        @Parent() production: Production,
        @Args("filter", { type: () => FilterProductionImageInput, nullable: true }) filter?: FilterProductionImageInput,
        @Args("order", { type: () => [OrderProductionImageInput], nullable: true }) order?: OrderProductionImageInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionImage[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (production["images"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionImage, { productionId: production.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionImage, { productionId: production.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.productionImage.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionVideos which have this Production as their {@link ProductionVideo#productionId}.
     */
    @ResolveField(() => [ProductionVideo], { nullable: true })
    @Rule(RuleType.ReadMany, ProductionVideo)
    async videos(
        @Context() ctx: { req: Request },
        @Parent() production: Production,
        @Args("filter", { type: () => FilterProductionVideoInput, nullable: true }) filter?: FilterProductionVideoInput,
        @Args("order", { type: () => [OrderProductionVideoInput], nullable: true }) order?: OrderProductionVideoInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionVideo[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (production["videos"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionVideo, { productionId: production.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionVideo, { productionId: production.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.productionVideo.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionRSVPs which have this Production as their {@link ProductionRSVP#productionId}.
     */
    @ResolveField(() => [ProductionRSVP], { nullable: true })
    @Rule(RuleType.ReadMany, ProductionRSVP)
    async rsvps(
        @Context() ctx: { req: Request },
        @Parent() production: Production,
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput,
        @Args("order", { type: () => [OrderProductionRSVPInput], nullable: true }) order?: OrderProductionRSVPInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionRSVP[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (production["rsvps"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, { productionId: production.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, { productionId: production.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.productionRSVP.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionTags which have this Production as their {@link ProductionTag#productionId}.
     */
    @ResolveField(() => [ProductionTag], { nullable: true })
    @Rule(RuleType.ReadMany, ProductionTag)
    async tags(
        @Context() ctx: { req: Request },
        @Parent() production: Production,
        @Args("filter", { type: () => FilterProductionTagInput, nullable: true }) filter?: FilterProductionTagInput,
        @Args("order", { type: () => [OrderProductionTagInput], nullable: true }) order?: OrderProductionTagInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionTag[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (production["tags"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionTag, { productionId: production.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionTag, { productionId: production.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.productionTag.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }
}
