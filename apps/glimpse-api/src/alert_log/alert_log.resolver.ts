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
import { AlertLog } from "./alert_log.entity";
import { FilterAlertLogInput } from "./dto/filter-alert_log.input";
import { OrderAlertLogInput } from "./dto/order-alert_log.input";
import { CreateAlertLogInput } from "./dto/create-alert_log.input";
import { UpdateAlertLogInput } from "./dto/update-alert_log.input";

@Resolver(() => AlertLog)
export class AlertLogResolver {
    private logger: Logger = new Logger("AlertLogResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [AlertLog], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, AlertLog)
    async findManyAlertLog(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAlertLogInput, nullable: true }) filter?: FilterAlertLogInput,
        @Args("order", { type: () => [OrderAlertLogInput], nullable: true }) order?: OrderAlertLogInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<AlertLog[]> {
        this.logger.verbose("findManyAlertLog resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).AlertLog, filter]
              }
            : accessibleBy(ctx.req.permissions).AlertLog;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.alertLog.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => AlertLog, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, AlertLog)
    async findOneAlertLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<AlertLog> {
        this.logger.verbose("findOneAlertLog resolver called");
        return ctx.req.prismaTx.alertLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AlertLog]
            }
        });
    }

    @Mutation(() => AlertLog, { complexity: Complexities.Create })
    @Rule(RuleType.Create, AlertLog)
    async createAlertLog(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateAlertLogInput }) input: CreateAlertLogInput
    ): Promise<AlertLog> {
        this.logger.verbose("createAlertLog resolver called");
        input = plainToClass(CreateAlertLogInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.alertLog.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "AlertLog",
            id: result.id
        });

        return result;
    }

    @Mutation(() => AlertLog, { complexity: Complexities.Update })
    @Rule(RuleType.Update, AlertLog)
    async updateAlertLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateAlertLogInput }) input: UpdateAlertLogInput
    ): Promise<AlertLog> {
        this.logger.verbose("updateAlertLog resolver called");
        input = plainToClass(UpdateAlertLogInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.alertLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AlertLog]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("AlertLog not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("AlertLog", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.alertLog.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "AlertLog",
            id: result.id
        });

        return result;
    }

    @Mutation(() => AlertLog, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, AlertLog)
    async deleteAlertLog(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<AlertLog> {
        this.logger.verbose("deleteAlertLog resolver called");

        const rowToDelete = await ctx.req.prismaTx.alertLog.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).AlertLog]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("AlertLog not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("AlertLog", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.alertLog.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "AlertLog",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, AlertLog)
    async alertLogCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterAlertLogInput, nullable: true }) filter?: FilterAlertLogInput
    ): Promise<number> {
        return ctx.req.prismaTx.alertLog.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).AlertLog, filter]
            }
        });
    }
}
