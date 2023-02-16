import {Args, Context, Directive, Int, Mutation, Parent, Query, ResolveField, Resolver} from "@nestjs/graphql";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";
import {BadRequestException, Logger} from "@nestjs/common";
import {accessibleBy} from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import {Complexities} from "../../gql/gql-complexity.plugin";
import {Request} from "express";
import {AbilityAction} from "../../casl/casl-ability.factory";
import {subject} from "@casl/ability";
import {ProductionTag} from "./production_tag.entity";
import {FilterProductionTagInput} from "./dto/filter-production_tag.input";
import {OrderProductionTagInput} from "./dto/order-production_tag.input";
import {CreateProductionTagInput} from "./dto/create-production_tag.input";
import {Production} from "../production/production.entity";
import {GraphQLBigInt} from "graphql-scalars";

@Resolver(() => ProductionTag)
export class ProductionTagResolver {
    private logger: Logger = new Logger("ProductionTagResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ProductionTag], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: ProductionTag)")
    async findManyProductionTag(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionTagInput, nullable: true }) filter?: FilterProductionTagInput,
        @Args("order", { type: () => [OrderProductionTagInput], nullable: true }) order?: OrderProductionTagInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionTag[]> {
        this.logger.verbose("findManyProductionTag resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).ProductionTag, filter]
              }
            : accessibleBy(ctx.req.permissions).ProductionTag;

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

    @Query(() => ProductionTag, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: ProductionTag)")
    async findOneProductionTag(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ProductionTag> {
        this.logger.verbose("findOneProductionTag resolver called");
        return ctx.req.prismaTx.productionTag.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionTag]
            }
        });
    }

    @Mutation(() => ProductionTag, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: ProductionTag)")
    async createProductionTag(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionTagInput }) input: CreateProductionTagInput
    ): Promise<ProductionTag> {
        this.logger.verbose("createProductionTag resolver called");
        input = plainToClass(CreateProductionTagInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.productionTag.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "ProductionTag",
            id: result.id
        });

        return result;
    }

    @Mutation(() => ProductionTag, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: ProductionTag)")
    async deleteProductionTag(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ProductionTag> {
        this.logger.verbose("deleteProductionTag resolver called");

        const rowToDelete = await ctx.req.prismaTx.productionTag.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).ProductionTag]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("ProductionTag not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("ProductionTag", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.productionTag.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "ProductionTag",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: ProductionTag)")
    async productionTagCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionTagInput, nullable: true }) filter?: FilterProductionTagInput
    ): Promise<number> {
        return ctx.req.prismaTx.productionTag.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).ProductionTag, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Production corresponding to the ProductionTag's {@link ProductionTag#productionId}.
     */
    @ResolveField(() => Production, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Production)")
    async production(@Context() ctx: { req: Request }, @Parent() productionTag: ProductionTag): Promise<Production> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!productionTag.productionId || productionTag["production"] === null) {
            return null;
        }
        return ctx.req.prismaTx.production.findFirst({
            where: { id: productionTag.productionId }
        });
    }
}
