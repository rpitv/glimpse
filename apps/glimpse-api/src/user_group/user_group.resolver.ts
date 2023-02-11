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
import { UserGroup } from "./user_group.entity";
import { FilterUserGroupInput } from "./dto/filter-user_group.input";
import { OrderUserGroupInput } from "./dto/order-user_group.input";
import { CreateUserGroupInput } from "./dto/create-user_group.input";
import { UpdateUserGroupInput } from "./dto/update-user_group.input";

@Resolver(() => UserGroup)
export class UserGroupResolver {
    private logger: Logger = new Logger("UserGroupResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [UserGroup], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, UserGroup)
    async findManyUserGroup(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserGroupInput, nullable: true }) filter?: FilterUserGroupInput,
        @Args("order", { type: () => [OrderUserGroupInput], nullable: true }) order?: OrderUserGroupInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<UserGroup[]> {
        this.logger.verbose("findManyUserGroup resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).UserGroup, filter]
              }
            : accessibleBy(ctx.req.permissions).UserGroup;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.userGroup.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => UserGroup, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, UserGroup)
    async findOneUserGroup(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<UserGroup> {
        this.logger.verbose("findOneUserGroup resolver called");
        return ctx.req.prismaTx.userGroup.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserGroup]
            }
        });
    }

    @Mutation(() => UserGroup, { complexity: Complexities.Create })
    @Rule(RuleType.Create, UserGroup)
    async createUserGroup(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateUserGroupInput }) input: CreateUserGroupInput
    ): Promise<UserGroup> {
        this.logger.verbose("createUserGroup resolver called");
        input = plainToClass(CreateUserGroupInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.userGroup.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "UserGroup",
            id: result.id
        });

        return result;
    }

    @Mutation(() => UserGroup, { complexity: Complexities.Update })
    @Rule(RuleType.Update, UserGroup)
    async updateUserGroup(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateUserGroupInput }) input: UpdateUserGroupInput
    ): Promise<UserGroup> {
        this.logger.verbose("updateUserGroup resolver called");
        input = plainToClass(UpdateUserGroupInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.userGroup.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserGroup]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("UserGroup not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("UserGroup", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.userGroup.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "UserGroup",
            id: result.id
        });

        return result;
    }

    @Mutation(() => UserGroup, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, UserGroup)
    async deleteUserGroup(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<UserGroup> {
        this.logger.verbose("deleteUserGroup resolver called");

        const rowToDelete = await ctx.req.prismaTx.userGroup.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).UserGroup]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("UserGroup not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("UserGroup", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.userGroup.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "UserGroup",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, UserGroup)
    async userGroupCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserGroupInput, nullable: true }) filter?: FilterUserGroupInput
    ): Promise<number> {
        return ctx.req.prismaTx.userGroup.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).UserGroup, filter]
            }
        });
    }
}
