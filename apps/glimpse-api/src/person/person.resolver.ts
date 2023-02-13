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
import { Person } from "./person.entity";
import { FilterPersonInput } from "./dto/filter-person.input";
import { OrderPersonInput } from "./dto/order-person.input";
import { CreatePersonInput } from "./dto/create-person.input";
import { UpdatePersonInput } from "./dto/update-person.input";

@Resolver(() => Person)
export class PersonResolver {
    private logger: Logger = new Logger("PersonResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Person], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, Person)
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
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Person, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, Person)
    async findOnePerson(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Person> {
        this.logger.verbose("findOnePerson resolver called");
        return ctx.req.prismaTx.person.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Person]
            }
        });
    }

    @Mutation(() => Person, { complexity: Complexities.Create })
    @Rule(RuleType.Create, Person)
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
    @Rule(RuleType.Update, Person)
    async updatePerson(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
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
    @Rule(RuleType.Delete, Person)
    async deletePerson(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Person> {
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
    @Rule(RuleType.Count, Person)
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
}
