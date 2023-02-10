import {Resolver, Query, Args, Int, Context, ResolveField, Parent} from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AuditLog } from "./audit_log.entity";
import { FilterAuditLogInput } from "./dto/filter-audit_log.input";
import { OrderAuditLogInput } from "./dto/order-audit_log.input";

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

    /**
     * The action that was performed on the entity. This is a computed field that is not stored in the database.
     *  It is calculated based on the {@link AuditLog#oldValue} and {@link AuditLog#newValue} fields.
     */
    @ResolveField(() => String)
    async action(@Parent() auditLog: AuditLog): Promise<string> {
        if(auditLog.oldValue === null && auditLog.newValue !== null) {
            return "created";
        } else if(auditLog.oldValue !== null && auditLog.newValue === null) {
            return "deleted";
        } else {
            return "updated";
        }
    }

    /**
     * A one-sentence summary of what this audit log contains. This is the main headline displayed to a user within
     *  the audit log list. For a detailed list of changes, use the {@link #details} field.
     */
    @ResolveField(() => [String])
    async details(@Parent() auditLog: AuditLog): Promise<string[]> {
        const changedFields = Object.keys(auditLog.newValue).filter((key) => auditLog.oldValue?.[key] !== auditLog.newValue?.[key]);
        const details: string[] = [];
        for(const field of changedFields) {
            if(field === "password") {
                details.push("changed password");
            } else {
                details.push(`changed ${field} from "${auditLog.oldValue?.[field]}" to "${auditLog.newValue?.[field]}"`);
            }
        }
        return details;
    }
}
