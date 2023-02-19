import { Args, Context, Directive, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Video } from "./video.entity";
import { FilterVideoInput } from "./dto/filter-video.input";
import { OrderVideoInput } from "./dto/order-video.input";
import { CreateVideoInput } from "./dto/create-video.input";
import { UpdateVideoInput } from "./dto/update-video.input";
import { ProductionVideo } from "../production_video/production_video.entity";
import { FilterProductionVideoInput } from "../production_video/dto/filter-production_video.input";
import { GraphQLBigInt } from "graphql-scalars";
import { OrderProductionVideoInput } from "../production_video/dto/order-production_video.input";

@Resolver(() => Video)
export class VideoResolver {
    private logger: Logger = new Logger("VideoResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Video], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Video)")
    async findManyVideo(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVideoInput, nullable: true }) filter?: FilterVideoInput,
        @Args("order", { type: () => [OrderVideoInput], nullable: true }) order?: OrderVideoInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Video[]> {
        this.logger.verbose("findManyVideo resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Video, filter]
              }
            : accessibleBy(ctx.req.permissions).Video;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.video.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => Video, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Video)")
    async findOneVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Video> {
        this.logger.verbose("findOneVideo resolver called");
        return ctx.req.prismaTx.video.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Video]
            }
        });
    }

    @Mutation(() => Video, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Video)")
    async createVideo(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateVideoInput }) input: CreateVideoInput
    ): Promise<Video> {
        this.logger.verbose("createVideo resolver called");
        input = plainToClass(CreateVideoInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.video.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Video",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Video, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Video)")
    async updateVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateVideoInput }) input: UpdateVideoInput
    ): Promise<Video> {
        this.logger.verbose("updateVideo resolver called");
        input = plainToClass(UpdateVideoInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.video.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Video]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Video not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Video", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.video.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Video",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Video, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Video)")
    async deleteVideo(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Video> {
        this.logger.verbose("deleteVideo resolver called");

        const rowToDelete = await ctx.req.prismaTx.video.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Video]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Video not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Video", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.video.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Video",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Video)")
    async videoCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterVideoInput, nullable: true }) filter?: FilterVideoInput
    ): Promise<number> {
        return ctx.req.prismaTx.video.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for all ProductionVideos which have this Video as their {@link ProductionVideo#videoId}.
     */
    @ResolveField(() => [ProductionVideo], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: ProductionVideo)")
    async productions(
        @Context() ctx: { req: Request },
        @Parent() video: Video,
        @Args("filter", { type: () => FilterProductionVideoInput, nullable: true }) filter?: FilterProductionVideoInput,
        @Args("order", { type: () => [OrderProductionVideoInput], nullable: true }) order?: OrderProductionVideoInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionVideo[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (video["productions"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionVideo, { videoId: video.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionVideo, { videoId: video.id }] };

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
}
