import { Resolver, Query, Args, Int, Context, ResolveField, Parent, Directive } from "@nestjs/graphql";
import { AccessLog } from "./access_log.entity";
import { Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { FilterAccessLogInput } from "./dto/filter-access_log.input";
import { OrderAccessLogInput } from "./dto/order-access_log.input";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { User } from "../user/user.entity";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";

@Resolver(() => AccessLog)
export class AccessLogResolver {
    private logger: Logger = new Logger("AccessLogResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [AccessLog], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: AccessLog)")
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
    @Directive("@rule(ruleType: ReadOne, subject: AccessLog)")
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

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: AccessLog)")
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

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the User corresponding to the AccessLog's {@link AccessLog#userId}.
     */
    @ResolveField(() => User, { nullable: true })
    async user(@Context() ctx: { req: Request }, @Parent() accessLog: AccessLog): Promise<User> {
        if (!ctx.req.permissions.can(AbilityAction.Read, subject("AccessLog", accessLog), "user")) {
            ctx.req.passed = false;
            return null;
        }
        if (!accessLog.userId) {
            return null;
        }
        return ctx.req.prismaTx.user.findFirst({
            where: {
                id: accessLog.userId
            }
        });
    }
}
