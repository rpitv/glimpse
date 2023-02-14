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
import { Credit } from "./credit.entity";
import { FilterCreditInput } from "./dto/filter-credit.input";
import { OrderCreditInput } from "./dto/order-credit.input";
import { CreateCreditInput } from "./dto/create-credit.input";
import { UpdateCreditInput } from "./dto/update-credit.input";
import {Person} from "../person/person.entity";
import {Production} from "../production/production.entity";

@Resolver(() => Credit)
export class CreditResolver {
    private logger: Logger = new Logger("CreditResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Credit], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Credit)")
    async findManyCredit(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterCreditInput, nullable: true }) filter?: FilterCreditInput,
        @Args("order", { type: () => [OrderCreditInput], nullable: true }) order?: OrderCreditInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Credit[]> {
        this.logger.verbose("findManyCredit resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Credit, filter]
              }
            : accessibleBy(ctx.req.permissions).Credit;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.credit.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Credit, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Credit)")
    async findOneCredit(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<Credit> {
        this.logger.verbose("findOneCredit resolver called");
        return ctx.req.prismaTx.credit.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Credit]
            }
        });
    }

    @Mutation(() => Credit, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Credit)")
    async createCredit(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateCreditInput }) input: CreateCreditInput
    ): Promise<Credit> {
        this.logger.verbose("createCredit resolver called");
        input = plainToClass(CreateCreditInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.credit.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Credit",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Credit, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Credit)")
    async updateCredit(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateCreditInput }) input: UpdateCreditInput
    ): Promise<Credit> {
        this.logger.verbose("updateCredit resolver called");
        input = plainToClass(UpdateCreditInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.credit.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Credit]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Credit not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Credit", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.credit.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Credit",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Credit, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Credit)")
    async deleteCredit(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Credit> {
        this.logger.verbose("deleteCredit resolver called");

        const rowToDelete = await ctx.req.prismaTx.credit.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Credit]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Credit not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Credit", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.credit.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Credit",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Credit)")
    async creditCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterCreditInput, nullable: true }) filter?: FilterCreditInput
    ): Promise<number> {
        return ctx.req.prismaTx.credit.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the Credit's {@link Credit#personId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Person)")
    async person(@Context() ctx: { req: Request }, @Parent() credit: Credit): Promise<Person> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!credit.personId || credit["person"] === null) {
            return null;
        }
        return ctx.req.prismaTx.person.findFirst({
            where: { id: credit.personId }
        });
    }

    /**
     * Virtual field resolver for the Production corresponding to the Credit's {@link Credit#productionId}.
     */
    @ResolveField(() => Production, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Production)")
    async production(@Context() ctx: { req: Request }, @Parent() credit: Credit): Promise<Production> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!credit.productionId || credit["production"] === null) {
            return null;
        }
        return ctx.req.prismaTx.production.findFirst({
            where: { id: credit.productionId }
        });
    }
}
