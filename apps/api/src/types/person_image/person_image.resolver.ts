import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { PersonImage } from "./person_image.entity";
import { FilterPersonImageInput } from "./dto/filter-person_image.input";
import { CreatePersonImageInput } from "./dto/create-person_image.input";
import { UpdatePersonImageInput } from "./dto/update-person_image.input";
import { OrderPersonImageInput } from "./dto/order-person_image.input";
import { Person } from "../person/person.entity";
import { Image } from "../image/image.entity";
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";
import PaginationInput from "../../gql/pagination.input";

@Resolver(() => PersonImage)
export class PersonImageResolver {
    private logger: Logger = new Logger("PersonImageResolver");

    // -------------------- Generic Resolvers --------------------
    @Query(() => [PersonImage], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, PersonImage)
    async findManyPersonImage(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonImageInput, nullable: true }) filter?: FilterPersonImageInput,
        @Args("order", { type: () => [OrderPersonImageInput], nullable: true }) order?: OrderPersonImageInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonImage[]>{
        this.logger.verbose("findManyPersonImage resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                AND: [accessibleBy(ctx.req.permissions).PersonImage, filter].filter(v => v !== undefined)
            }
            : accessibleBy(ctx.req.permissions).PersonImage;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.personRole.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => PersonImage, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, PersonImage)
    async findOnePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<PersonImage> {
        this.logger.verbose("findOnePersonImage resolver called");
        return ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Create })
    @Rule(RuleType.Create, PersonImage)
    async createPersonImage(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreatePersonImageInput }) input: CreatePersonImageInput
    ): Promise<PersonImage> {
        this.logger.verbose("createPersonImage resolver called");
        input = plainToClass(CreatePersonImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.personImage.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Update })
    @Rule(RuleType.Update, PersonImage)
    async updatePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdatePersonImageInput }) input: UpdatePersonImageInput
    ): Promise<PersonImage> {
        this.logger.verbose("updatePersonImage resolver called");
        input = plainToClass(UpdatePersonImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("PersonImage not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("PersonImage", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.personImage.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, PersonImage)
    async deletePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<PersonImage> {
        this.logger.verbose("deletePersonImage resolver called");

        const rowToDelete = await ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("PersonImage not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("PersonImage", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.personImage.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, PersonImage)
    async personImageCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonImageInput, nullable: true }) filter?: FilterPersonImageInput
    ): Promise<number> {
        return ctx.req.prismaTx.personImage.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).PersonImage, filter].filter(v => v !== undefined)
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the PersonImage's {@link PersonImage#personId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Rule(RuleType.ReadOne, Person)
    async person(@Context() ctx: { req: Request }, @Parent() personImage: PersonImage): Promise<Person> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!personImage.personId || personImage["person"] === null) {
            return null;
        }
        return ctx.req.prismaTx.person.findFirst({
            where: { id: personImage.personId }
        });
    }

    /**
     * Virtual field resolver for the Image corresponding to the PersonImage's {@link PersonImage#imageId}.
     */
    @ResolveField(() => Image, { nullable: true })
    @Rule(RuleType.ReadOne, Image)
    async image(@Context() ctx: { req: Request }, @Parent() personImage: PersonImage): Promise<Image> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!personImage.imageId || personImage["image"] === null) {
            return null;
        }
        return ctx.req.prismaTx.image.findFirst({
            where: { id: personImage.imageId }
        });
    }
}
