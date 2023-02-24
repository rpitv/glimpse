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
import { Person } from "./person.entity";
import { FilterPersonInput } from "./dto/filter-person.input";
import { OrderPersonInput } from "./dto/order-person.input";
import { CreatePersonInput } from "./dto/create-person.input";
import { UpdatePersonInput } from "./dto/update-person.input";
import { BlogPost } from "../blog_post/blog_post.entity";
import { FilterBlogPostInput } from "../blog_post/dto/filter-blog_post.input";
import { OrderBlogPostInput } from "../blog_post/dto/order-blog_post.input";
import { Credit } from "../credit/credit.entity";
import { FilterCreditInput } from "../credit/dto/filter-credit.input";
import { OrderCreditInput } from "../credit/dto/order-credit.input";
import { FilterPersonImageInput } from "../person_image/dto/filter-person_image.input";
import { PersonImage } from "../person_image/person_image.entity";
import { PersonRole } from "../person_role/person_role.entity";
import { FilterPersonRoleInput } from "../person_role/dto/filter-person_role.input";
import { OrderPersonRoleInput } from "../person_role/dto/order-person_role.input";
import { User } from "../user/user.entity";
import { FilterUserInput } from "../user/dto/filter-user.input";
import { OrderUserInput } from "../user/dto/order-user.input";
import { GraphQLBigInt } from "graphql-scalars";
import {Image} from "../image/image.entity";

@Resolver(() => Person)
export class PersonResolver {
    private logger: Logger = new Logger("PersonResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Person], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Person)")
    async findManyPerson(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonInput, nullable: true }) filter?: FilterPersonInput,
        @Args("order", { type: () => [OrderPersonInput], nullable: true }) order?: OrderPersonInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Person[]> {
        this.logger.verbose("findManyPerson resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Person, filter]
              }
            : accessibleBy(ctx.req.permissions).Person;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.person.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => Person, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Person)")
    async findOnePerson(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Person> {
        this.logger.verbose("findOnePerson resolver called");
        return ctx.req.prismaTx.person.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Person]
            }
        });
    }

    @Mutation(() => Person, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Person)")
    async createPerson(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreatePersonInput }) input: CreatePersonInput
    ): Promise<Person> {
        this.logger.verbose("createPerson resolver called");
        input = plainToClass(CreatePersonInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.person.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Person",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Person, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Person)")
    async updatePerson(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdatePersonInput }) input: UpdatePersonInput
    ): Promise<Person> {
        this.logger.verbose("updatePerson resolver called");
        input = plainToClass(UpdatePersonInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.person.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Person]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Person not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Person", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.person.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Person",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Person, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Person)")
    async deletePerson(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<Person> {
        this.logger.verbose("deletePerson resolver called");

        const rowToDelete = await ctx.req.prismaTx.person.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Person]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Person not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Person", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.person.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Person",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Person)")
    async personCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonInput, nullable: true }) filter?: FilterPersonInput
    ): Promise<number> {
        return ctx.req.prismaTx.person.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for all BlogPosts which have this Person as their {@link BlogPost#authorId}.
     */
    @ResolveField(() => [BlogPost], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: BlogPost)")
    async blogPosts(
        @Context() ctx: { req: Request },
        @Parent() person: Person,
        @Args("filter", { type: () => FilterBlogPostInput, nullable: true }) filter?: FilterBlogPostInput,
        @Args("order", { type: () => [OrderBlogPostInput], nullable: true }) order?: OrderBlogPostInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<BlogPost[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (person["blogPosts"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).BlogPost, { authorId: person.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).BlogPost, { authorId: person.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.blogPost.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all Credits which have this Person as their {@link Credit#personId}.
     */
    @ResolveField(() => [Credit], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Credit)")
    async credits(
        @Context() ctx: { req: Request },
        @Parent() person: Person,
        @Args("filter", { type: () => FilterCreditInput, nullable: true }) filter?: FilterCreditInput,
        @Args("order", { type: () => [OrderCreditInput], nullable: true }) order?: OrderCreditInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Credit[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (person["credits"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Credit, { personId: person.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Credit, { personId: person.id }] };

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
     * Virtual field resolver for all PersonImages which have this Person as their {@link PersonImage#personId}.
     */
    @ResolveField(() => [PersonImage], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: PersonImage)")
    async images(
        @Context() ctx: { req: Request },
        @Parent() person: Person,
        @Args("filter", { type: () => FilterPersonImageInput, nullable: true }) filter?: FilterPersonImageInput,
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonImage[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (person["images"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).PersonImage, { personId: person.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).PersonImage, { personId: person.id }] };

        return ctx.req.prismaTx.personImage.findMany({
            where,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all PersonRoles which have this Person as their {@link PersonRole#personId}.
     */
    @ResolveField(() => [PersonRole], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: PersonRole)")
    async roles(
        @Context() ctx: { req: Request },
        @Parent() person: Person,
        @Args("filter", { type: () => FilterPersonRoleInput, nullable: true }) filter?: FilterPersonRoleInput,
        @Args("order", { type: () => [OrderPersonRoleInput], nullable: true }) order?: OrderPersonRoleInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonRole[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (person["roles"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).PersonRole, { personId: person.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).PersonRole, { personId: person.id }] };

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

    /**
     * Virtual field resolver for all Users which have this Person as their {@link User#personId}.
     */
    @ResolveField(() => [User], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: User)")
    async users(
        @Context() ctx: { req: Request },
        @Parent() person: Person,
        @Args("filter", { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput,
        @Args("order", { type: () => [OrderUserInput], nullable: true }) order?: OrderUserInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<User[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (person["users"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).User, { personId: person.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).User, { personId: person.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.user.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for the Image corresponding to the Production's {@link Person#profilePictureId}.
     */
    @ResolveField(() => Image, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Image)")
    async profilePicture(@Context() ctx: { req: Request }, @Parent() person: Person): Promise<Image> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!person.profilePictureId || person["profilePicture"] === null) {
            return null;
        }
        return ctx.req.prismaTx.image.findFirst({
            where: { id: person.profilePictureId }
        });
    }
}



