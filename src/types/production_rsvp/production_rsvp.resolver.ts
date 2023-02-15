import {Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent, ID} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { ProductionRSVP } from "./production_rsvp.entity";
import { FilterProductionRSVPInput } from "./dto/filter-production_rsvp.input";
import { OrderProductionRSVPInput } from "./dto/order-production_rsvp.input";
import { CreateProductionRSVPInput } from "./dto/create-production_rsvp.input";
import { UpdateProductionRSVPInput } from "./dto/update-production_rsvp.input";
import { Production } from "../production/production.entity";
import { User } from "../user/user.entity";

@Resolver(() => ProductionRSVP)
export class ProductionRSVPResolver {
    private logger: Logger = new Logger("ProductionRSVPResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ProductionRSVP], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: ProductionRSVP)")
    async findManyProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput,
        @Args("order", { type: () => [OrderProductionRSVPInput], nullable: true }) order?: OrderProductionRSVPInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionRSVP[]> {
        this.logger.verbose("findManyProductionRSVP resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, filter]
              }
            : accessibleBy(ctx.req.permissions).ProductionRSVP;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.productionRSVP.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => ProductionRSVP, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: ProductionRSVP)")
    async findOneProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
    ): Promise<ProductionRSVP> {
        this.logger.verbose("findOneProductionRSVP resolver called");
        return ctx.req.prismaTx.productionRSVP.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionRSVP]
            }
        });
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: ProductionRSVP)")
    async createProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionRSVPInput }) input: CreateProductionRSVPInput
    ): Promise<ProductionRSVP> {
        this.logger.verbose("createProductionRSVP resolver called");
        input = plainToClass(CreateProductionRSVPInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.productionRSVP.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: ProductionRSVP)")
    async updateProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
        @Args("input", { type: () => UpdateProductionRSVPInput }) input: UpdateProductionRSVPInput
    ): Promise<ProductionRSVP> {
        this.logger.verbose("updateProductionRSVP resolver called");
        input = plainToClass(UpdateProductionRSVPInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.productionRSVP.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionRSVP]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("ProductionRSVP not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("ProductionRSVP", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.productionRSVP.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: ProductionRSVP)")
    async deleteProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
    ): Promise<ProductionRSVP> {
        this.logger.verbose("deleteProductionRSVP resolver called");

        const rowToDelete = await ctx.req.prismaTx.productionRSVP.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionRSVP]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ProductionRSVP not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ProductionRSVP", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.productionRSVP.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ProductionRSVP",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: ProductionRSVP)")
    async productionRSVPCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput
    ): Promise<number> {
        return ctx.req.prismaTx.productionRSVP.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Production corresponding to the ProductionRSVP's {@link ProductionRSVP#productionId}.
     */
    @ResolveField(() => Production, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Production)")
    async production(@Context() ctx: { req: Request }, @Parent() productionRSVP: ProductionRSVP): Promise<Production> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!productionRSVP.productionId || productionRSVP["production"] === null) {
            return null;
        }
        return ctx.req.prismaTx.production.findFirst({
            where: { id: productionRSVP.productionId }
        });
    }

    /**
     * Virtual field resolver for the User corresponding to the ProductionRSVP's {@link ProductionRSVP#userId}.
     */
    @ResolveField(() => User, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: User)")
    async user(@Context() ctx: { req: Request }, @Parent() productionRSVP: ProductionRSVP): Promise<User> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!productionRSVP.userId || productionRSVP["user"] === null) {
            return null;
        }
        return ctx.req.prismaTx.user.findFirst({
            where: { id: productionRSVP.userId }
        });
    }
}
