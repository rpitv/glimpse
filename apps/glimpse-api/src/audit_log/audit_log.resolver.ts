import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { AuditLog } from "./audit_log.entity";
import { FilterAuditLogInput } from "./dto/filter-audit_log.input";
import { OrderAuditLogInput } from "./dto/order-audit_log.input";
import { UpdateAuditLogInput } from "./dto/update-audit_log.input";

@Resolver(() => AuditLog)
export class AuditLogResolver {
    private logger: Logger = new Logger("AuditLogResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [AuditLog], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, AuditLog)
    async findManyAuditLog(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAuditLogInput, nullable: true }) filter?: FilterAuditLogInput,
        @Args("order", { type: () => [OrderAuditLogInput], nullable: true }) order?: OrderAuditLogInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<AuditLog[]> {
        this.logger.verbose("findManyAuditLog resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).AuditLog, filter]
              }
            : accessibleBy(ctx.req.permissions).AuditLog;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.auditLog.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => AuditLog, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, AuditLog)
    async findOneAuditLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<AuditLog> {
        this.logger.verbose("findOneAuditLog resolver called");
        return ctx.req.prismaTx.auditLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AuditLog]
            }
        });
    }

    @Mutation(() => AuditLog, { complexity: Complexities.Update })
    @Rule(RuleType.Update, AuditLog)
    async updateAuditLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateAuditLogInput }) input: UpdateAuditLogInput
    ): Promise<AuditLog> {
        this.logger.verbose("updateAuditLog resolver called");
        input = plainToClass(UpdateAuditLogInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.auditLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AuditLog]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("AuditLog not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("AuditLog", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        return ctx.req.prismaTx.auditLog.update({
            where: {
                id
            },
            data: input
        });
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, AuditLog)
    async auditLogCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAuditLogInput, nullable: true }) filter?: FilterAuditLogInput
    ): Promise<number> {
        return ctx.req.prismaTx.auditLog.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).AuditLog, filter]
            }
        });
    }
}
