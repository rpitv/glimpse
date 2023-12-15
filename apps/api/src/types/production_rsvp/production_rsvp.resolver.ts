import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { ProductionRSVP } from "./production_rsvp.entity";
import { FilterProductionRSVPInput } from "./dto/filter-production_rsvp.input";
import { OrderProductionRSVPInput } from "./dto/order-production_rsvp.input";
import { CreateProductionRSVPInput } from "./dto/create-production_rsvp.input";
import { UpdateProductionRSVPInput } from "./dto/update-production_rsvp.input";
import { Production } from "../production/production.entity";
import { User } from "../user/user.entity";
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";
import { ProductionRSVPService } from "./production_rsvp.service";

@Resolver(() => ProductionRSVP)
export class ProductionRSVPResolver {
    private logger: Logger = new Logger("ProductionRSVPResolver");
    constructor(private readonly productionRSVPService: ProductionRSVPService) {}

    // -------------------- Generic Resolvers --------------------

    @Query(() => [ProductionRSVP], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, ProductionRSVP)
    async findManyProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput,
        @Args("order", { type: () => [OrderProductionRSVPInput], nullable: true }) order?: OrderProductionRSVPInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionRSVP[]> {
        this.logger.verbose("findManyProductionRSVP resolver called");
        return this.productionRSVPService.findManyProductionRSVP(ctx.req.prismaTx, { filter, order, pagination }, ctx);
    }

    @Query(() => ProductionRSVP, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, ProductionRSVP)
    async findOneProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ProductionRSVP> {
        this.logger.verbose("findOneProductionRSVP resolver called");
        return this.productionRSVPService.findOneProductionRSVP(id, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Create })
    @Rule(RuleType.Create, ProductionRSVP)
    async createProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateProductionRSVPInput }) input: CreateProductionRSVPInput
    ): Promise<ProductionRSVP> {
        this.logger.verbose("createProductionRSVP resolver called");
        return this.productionRSVPService.createProductionRSVP(input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Update })
    @Rule(RuleType.Update, ProductionRSVP)
    async updateProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateProductionRSVPInput }) input: UpdateProductionRSVPInput
    ): Promise<ProductionRSVP> {
        this.logger.verbose("updateProductionRSVP resolver called");
        return this.productionRSVPService.updateProductionRSVP(id, input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => ProductionRSVP, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, ProductionRSVP)
    async deleteProductionRSVP(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<ProductionRSVP> {
        this.logger.verbose("deleteProductionRSVP resolver called");
        return this.productionRSVPService.deleteProductionRSVP(id, ctx.req.prismaTx, ctx);
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, ProductionRSVP)
    async productionRSVPCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput
    ): Promise<number> {
        this.logger.verbose("productionRSVPCount resolver called");
        return this.productionRSVPService.productionRSVPCount(ctx.req.prismaTx, { filter }, ctx);
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Production corresponding to the ProductionRSVP's {@link ProductionRSVP#productionId}.
     */
    @ResolveField(() => Production, { nullable: true })
    @Rule(RuleType.ReadOne, Production)
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
    @Rule(RuleType.ReadOne, User)
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
