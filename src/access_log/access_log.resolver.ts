import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { AccessLog } from "./access_log.entity";
import { BadRequestException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import { FilterAccessLogInput } from "./dto/filter-access_log.input";
import { OrderAccessLogInput } from "./dto/order-access_log.input";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";

@Resolver(() => AccessLog)
export class AccessLogResolver {
    private logger: Logger = new Logger("AccessLogResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [AccessLog], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, AccessLog)
    async findManyAccessLog(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAccessLogInput, nullable: true }) filter?: FilterAccessLogInput,
        @Args("order", { type: () => [OrderAccessLogInput], nullable: true }) order?: OrderAccessLogInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<AccessLog[]> {
        this.logger.verbose("findManyAccessLog resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).AccessLog, filter]
              }
            : accessibleBy(ctx.req.permissions).AccessLog;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.accessLog.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => AccessLog, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, AccessLog)
    async findOneAccessLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<AccessLog> {
        this.logger.verbose("findOneAccessLog resolver called");
        return ctx.req.prismaTx.accessLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AccessLog]
            }
        });
    }

    @Mutation(() => AccessLog, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, AccessLog)
    async deleteAccessLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<AccessLog> {
        this.logger.verbose("deleteAccessLog resolver called");

        const rowToDelete = await ctx.req.prismaTx.accessLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AccessLog]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("AccessLog not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("AccessLog", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        return ctx.req.prismaTx.accessLog.delete({
            where: {
                id
            }
        });
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, AccessLog)
    async accessLogCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAccessLogInput, nullable: true }) filter?: FilterAccessLogInput
    ): Promise<number> {
        return ctx.req.prismaTx.accessLog.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).AccessLog, filter]
            }
        });
    }
}
