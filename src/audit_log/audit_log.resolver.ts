import { Resolver, Query, Args, Int, Context, ResolveField, Parent, Directive } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AuditLog } from "./audit_log.entity";
import { FilterAuditLogInput } from "./dto/filter-audit_log.input";
import { OrderAuditLogInput } from "./dto/order-audit_log.input";
import { AbilityAction, AbilitySubjects } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { User } from "../user/user.entity";

@Resolver(() => AuditLog)
export class AuditLogResolver {
    private logger: Logger = new Logger("AuditLogResolver");

    /**
     * These are fields which should have their values hidden within the details resolver. Instead of specifying what
     *  the value was updated to/from, a simple "updated <key>" message will be returned. This is the case even if the
     *  field was deleted or created.
     * @private
     */
    private readonly hiddenFields: Partial<Record<Extract<AbilitySubjects, string>, string[]>> = {
        User: ["password"]
    };

    // -------------------- Generic Resolvers --------------------

    @Query(() => [AuditLog], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: AuditLog)")
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
    @Directive("@rule(ruleType: ReadOne, subject: AuditLog)")
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
    @Directive("@rule(ruleType: Count, subject: AuditLog)")
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
        if (auditLog.oldValue === null && auditLog.newValue !== null) {
            return "created";
        } else if (auditLog.oldValue !== null && auditLog.newValue === null) {
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
        // Collect a set of all the keys which have either been added, updated, or removed.
        const changedFields: Set<string> = new Set();
        if (typeof auditLog.oldValue === "object" && auditLog.oldValue !== null) {
            Object.keys(auditLog.oldValue).forEach((key) => {
                if (auditLog.oldValue[key] !== auditLog.newValue?.[key]) {
                    changedFields.add(key);
                }
            });
        }
        if (typeof auditLog.newValue === "object" && auditLog.newValue !== null) {
            Object.keys(auditLog.newValue).forEach((key) => {
                if (auditLog.newValue[key] !== auditLog.oldValue?.[key]) {
                    changedFields.add(key);
                }
            });
        }

        const details: string[] = [];
        // Build a list of human-readable strings describing the changes.
        for (const key of changedFields) {
            // Don't include hidden fields in the details, nor whether it was added/removed (just "updated").
            if (this.hiddenFields[auditLog.subject]?.includes(key)) {
                details.push(`Updated \`${key}\``);
                continue;
            }

            if (auditLog.oldValue?.[key] === undefined) {
                details.push(`Added \`${key}\` with value "${auditLog.newValue?.[key]}"`);
            } else if (auditLog.newValue?.[key] === undefined) {
                details.push(`Deleted \`${key}\`, previously "${auditLog.oldValue?.[key]}"`);
            } else {
                details.push(`Updated \`${key}\` from "${auditLog.oldValue?.[key]}" to "${auditLog.newValue?.[key]}"`);
            }
        }

        return details;
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the AuditLog corresponding to the AuditLog's {@link AuditLog#userId}.
     */
    @ResolveField(() => User, { nullable: true })
    async user(@Context() ctx: { req: Request }, @Parent() auditLog: AuditLog): Promise<User> {
        if (!ctx.req.permissions.can(AbilityAction.Read, subject("AuditLog", auditLog), "user")) {
            ctx.req.passed = false;
            return null;
        }
        if (!auditLog.userId) {
            return null;
        }
        return ctx.req.prismaTx.user.findFirst({
            where: {
                id: auditLog.userId
            }
        });
    }
}
