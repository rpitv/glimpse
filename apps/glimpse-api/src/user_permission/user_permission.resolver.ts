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
import { UserPermission } from "./user_permission.entity";
import { FilterUserPermissionInput } from "./dto/filter-user_permission.input";
import { OrderUserPermissionInput } from "./dto/order-user_permission.input";
import { CreateUserPermissionInput } from "./dto/create-user_permission.input";
import { UpdateUserPermissionInput } from "./dto/update-user_permission.input";

@Resolver(() => UserPermission)
export class UserPermissionResolver {
    private logger: Logger = new Logger("UserPermissionResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [UserPermission], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, UserPermission)
    async findManyUserPermission(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserPermissionInput, nullable: true }) filter?: FilterUserPermissionInput,
        @Args("order", { type: () => [OrderUserPermissionInput], nullable: true }) order?: OrderUserPermissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<UserPermission[]> {
        this.logger.verbose("findManyUserPermission resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).UserPermission, filter]
              }
            : accessibleBy(ctx.req.permissions).UserPermission;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.userPermission.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => UserPermission, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, UserPermission)
    async findOneUserPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<UserPermission> {
        this.logger.verbose("findOneUserPermission resolver called");
        return ctx.req.prismaTx.userPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserPermission]
            }
        });
    }

    @Mutation(() => UserPermission, { complexity: Complexities.Create })
    @Rule(RuleType.Create, UserPermission)
    async createUserPermission(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateUserPermissionInput }) input: CreateUserPermissionInput
    ): Promise<UserPermission> {
        this.logger.verbose("createUserPermission resolver called");
        input = plainToClass(CreateUserPermissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.userPermission.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "UserPermission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => UserPermission, { complexity: Complexities.Update })
    @Rule(RuleType.Update, UserPermission)
    async updateUserPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateUserPermissionInput }) input: UpdateUserPermissionInput
    ): Promise<UserPermission> {
        this.logger.verbose("updateUserPermission resolver called");
        input = plainToClass(UpdateUserPermissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.userPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserPermission]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("UserPermission not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("UserPermission", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.userPermission.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "UserPermission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => UserPermission, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, UserPermission)
    async deleteUserPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<UserPermission> {
        this.logger.verbose("deleteUserPermission resolver called");

        const rowToDelete = await ctx.req.prismaTx.userPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserPermission]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("UserPermission not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("UserPermission", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.userPermission.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "UserPermission",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, UserPermission)
    async userPermissionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserPermissionInput, nullable: true }) filter?: FilterUserPermissionInput
    ): Promise<number> {
        return ctx.req.prismaTx.userPermission.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).UserPermission, filter]
            }
        });
    }
}
