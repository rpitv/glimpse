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
import { Image } from "./image.entity";
import { FilterImageInput } from "./dto/filter-image.input";
import { OrderImageInput } from "./dto/order-image.input";
import { CreateImageInput } from "./dto/create-image.input";
import { UpdateImageInput } from "./dto/update-image.input";

@Resolver(() => Image)
export class ImageResolver {
    private logger: Logger = new Logger("ImageResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Image], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Image)
    async findManyImage(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterImageInput, nullable: true }) filter?: FilterImageInput,
        @Args("order", { type: () => [OrderImageInput], nullable: true }) order?: OrderImageInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Image[]> {
        this.logger.verbose("findManyImage resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Image, filter]
              }
            : accessibleBy(ctx.req.permissions).Image;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.image.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Image, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Image)
    async findOneImage(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Image> {
        this.logger.verbose("findOneImage resolver called");
        return ctx.req.prismaTx.image.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Image]
            }
        });
    }

    @Mutation(() => Image, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Image)
    async createImage(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateImageInput }) input: CreateImageInput
    ): Promise<Image> {
        this.logger.verbose("createImage resolver called");
        input = plainToClass(CreateImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.image.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Image",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Image, { complexity: Complexities.Update })
    @Rule(RuleType.Update, Image)
    async updateImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateImageInput }) input: UpdateImageInput
    ): Promise<Image> {
        this.logger.verbose("updateImage resolver called");
        input = plainToClass(UpdateImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.image.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Image]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Image not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Image", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.image.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Image",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Image, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, Image)
    async deleteImage(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Image> {
        this.logger.verbose("deleteImage resolver called");

        const rowToDelete = await ctx.req.prismaTx.image.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Image]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Image not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Image", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.image.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Image",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, Image)
    async imageCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterImageInput, nullable: true }) filter?: FilterImageInput
    ): Promise<number> {
        return ctx.req.prismaTx.image.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }
}
