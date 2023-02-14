import {Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Image } from "./image.entity";
import { FilterImageInput } from "./dto/filter-image.input";
import { OrderImageInput } from "./dto/order-image.input";
import { CreateImageInput } from "./dto/create-image.input";
import { UpdateImageInput } from "./dto/update-image.input";
import {PersonImage} from "../person_image/person_image.entity";
import {ProductionImage} from "../production_image/production_image.entity";
import {FilterPersonImageInput} from "../person_image/dto/filter-person_image.input";
import {FilterProductionImageInput} from "../production_image/dto/filter-production_image.input";
import {Production} from "../production/production.entity";
import {FilterProductionInput} from "../production/dto/filter-production.input";
import {OrderProductionInput} from "../production/dto/order-production.input";
import {Person} from "../person/person.entity";
import {FilterPersonInput} from "../person/dto/filter-person.input";
import {OrderPersonInput} from "../person/dto/order-person.input";

@Resolver(() => Image)
export class ImageResolver {
    private logger: Logger = new Logger("ImageResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Image], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Image)")
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
    @Directive("@rule(ruleType: ReadOne, subject: Image)")
    async findOneImage(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Image> {
        this.logger.verbose("findOneImage resolver called");
        return ctx.req.prismaTx.image.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Image]
            }
        });
    }

    @Mutation(() => Image, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Image)")
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
    @Directive("@rule(ruleType: Update, subject: Image)")
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
    @Directive("@rule(ruleType: Delete, subject: Image)")
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
    @Directive("@rule(ruleType: Count, subject: Image)")
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

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for all PersonImages which have this Image as their {@link PersonImage#imageId}.
     */
    @ResolveField(() => [PersonImage], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: PersonImage)")
    async people(
        @Context() ctx: { req: Request },
        @Parent() image: Image,
        @Args("filter", { type: () => FilterPersonImageInput, nullable: true }) filter?: FilterPersonImageInput,
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonImage[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (image["people"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).PersonImage, { imageId: image.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).PersonImage, { imageId: image.id }] };

        return ctx.req.prismaTx.personImage.findMany({
            where,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionImages which have this Image as their {@link ProductionImage#imageId}.
     */
    @ResolveField(() => [ProductionImage], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: ProductionImage)")
    async productions(
        @Context() ctx: { req: Request },
        @Parent() image: Image,
        @Args("filter", { type: () => FilterProductionImageInput, nullable: true }) filter?: FilterProductionImageInput,
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionImage[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (image["productions"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionImage, { imageId: image.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionImage, { imageId: image.id }] };

        return ctx.req.prismaTx.productionImage.findMany({
            where,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all Productions which have this Image as their {@link Production#thumbnailId}.
     */
    @ResolveField(() => [Production], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Production)")
    async thumbnailFor(
        @Context() ctx: { req: Request },
        @Parent() image: Image,
        @Args("filter", { type: () => FilterProductionInput, nullable: true }) filter?: FilterProductionInput,
        @Args("order", { type: () => [OrderProductionInput], nullable: true }) order?: OrderProductionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Production[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (image["thumbnailFor"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Production, { thumbnailId: image.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Production, { thumbnailId: image.id }] };

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

    /**
     * Virtual field resolver for all Persons which have this Image as their {@link Person#profilePictureId}.
     */
    @ResolveField(() => [Person], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Person)")
    async profilePictureFor(
        @Context() ctx: { req: Request },
        @Parent() image: Image,
        @Args("filter", { type: () => FilterPersonInput, nullable: true }) filter?: FilterPersonInput,
        @Args("order", { type: () => [OrderPersonInput], nullable: true }) order?: OrderPersonInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Person[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (image["profilePictureFor"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Person, { profilePictureId: image.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Person, { profilePictureId: image.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.person.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }
}
