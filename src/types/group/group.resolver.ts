import { Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Group } from "./group.entity";
import { FilterGroupInput } from "./dto/filter-group.input";
import { OrderGroupInput } from "./dto/order-group.input";
import { CreateGroupInput } from "./dto/create-group.input";
import { UpdateGroupInput } from "./dto/update-group.input";
import { GroupPermission } from "../group_permission/group_permission.entity";
import { FilterGroupPermissionInput } from "../group_permission/dto/filter-group_permission.input";
import { OrderGroupPermissionInput } from "../group_permission/dto/order-group_permission.input";
import { UserGroup } from "../user_group/user_group.entity";
import { FilterUserGroupInput } from "../user_group/dto/filter-user_group.input";

@Resolver(() => Group)
export class GroupResolver {
    private logger: Logger = new Logger("GroupResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Group], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Group)")
    async findManyGroup(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterGroupInput, nullable: true }) filter?: FilterGroupInput,
        @Args("order", { type: () => [OrderGroupInput], nullable: true }) order?: OrderGroupInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Group[]> {
        this.logger.verbose("findManyGroup resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Group, filter]
              }
            : accessibleBy(ctx.req.permissions).Group;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.group.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Group, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Group)")
    async findOneGroup(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Group> {
        this.logger.verbose("findOneGroup resolver called");
        return ctx.req.prismaTx.group.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Group]
            }
        });
    }

    @Mutation(() => Group, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Group)")
    async createGroup(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateGroupInput }) input: CreateGroupInput
    ): Promise<Group> {
        this.logger.verbose("createGroup resolver called");
        input = plainToClass(CreateGroupInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.group.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Group",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Group, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Group)")
    async updateGroup(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateGroupInput }) input: UpdateGroupInput
    ): Promise<Group> {
        this.logger.verbose("updateGroup resolver called");
        input = plainToClass(UpdateGroupInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.group.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Group]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Group not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Group", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.group.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Group",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Group, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Group)")
    async deleteGroup(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<Group> {
        this.logger.verbose("deleteGroup resolver called");

        const rowToDelete = await ctx.req.prismaTx.group.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Group]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Group not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Group", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.group.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Group",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Group)")
    async groupCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterGroupInput, nullable: true }) filter?: FilterGroupInput
    ): Promise<number> {
        return ctx.req.prismaTx.group.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Group, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Group corresponding to the Group's {@link Group#parentId}.
     */
    @ResolveField(() => Group, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Group)")
    async parent(@Context() ctx: { req: Request }, @Parent() group: Group): Promise<Group> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!group.parentId || group["parent"] === null) {
            return null;
        }
        return ctx.req.prismaTx.group.findFirst({
            where: { id: group.parentId }
        });
    }

    /**
     * Virtual field resolver for all GroupPermissions which have this Group as their {@link GroupPermission#groupId}.
     */
    @ResolveField(() => [GroupPermission], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: GroupPermission)")
    async permissions(
        @Context() ctx: { req: Request },
        @Parent() group: Group,
        @Args("filter", { type: () => FilterGroupPermissionInput, nullable: true }) filter?: FilterGroupPermissionInput,
        @Args("order", { type: () => [OrderGroupPermissionInput], nullable: true }) order?: OrderGroupPermissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<GroupPermission[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (group["permissions"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).GroupPermission, { groupId: group.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).GroupPermission, { groupId: group.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.groupPermission.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all Groups which have this Group as their {@link Group#parentId}.
     */
    @ResolveField(() => [Group], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Group)")
    async children(
        @Context() ctx: { req: Request },
        @Parent() group: Group,
        @Args("filter", { type: () => FilterGroupInput, nullable: true }) filter?: FilterGroupInput,
        @Args("order", { type: () => [OrderGroupInput], nullable: true }) order?: OrderGroupInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Group[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (group["children"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Group, { parentId: group.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Group, { parentId: group.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.group.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all UserGroups which have this Group as their {@link UserGroup#groupId}.
     */
    @ResolveField(() => [UserGroup], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: UserGroup)")
    async users(
        @Context() ctx: { req: Request },
        @Parent() group: Group,
        @Args("filter", { type: () => FilterUserGroupInput, nullable: true }) filter?: FilterUserGroupInput,
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<UserGroup[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (group["users"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).UserGroup, { groupId: group.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).UserGroup, { groupId: group.id }] };

        return ctx.req.prismaTx.userGroup.findMany({
            where,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }
}
