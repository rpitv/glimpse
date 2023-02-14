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
import { GroupPermission } from "./group_permission.entity";
import { FilterGroupPermissionInput } from "./dto/filter-group_permission.input";
import { OrderGroupPermissionInput } from "./dto/order-group_permission.input";
import { CreateGroupPermissionInput } from "./dto/create-group_permission.input";
import { UpdateGroupPermissionInput } from "./dto/update-group_permission.input";
import { Group } from "../group/group.entity";

@Resolver(() => GroupPermission)
export class GroupPermissionResolver {
    private logger: Logger = new Logger("GroupPermissionResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [GroupPermission], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: GroupPermission)")
    async findManyGroupPermission(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterGroupPermissionInput, nullable: true }) filter?: FilterGroupPermissionInput,
        @Args("order", { type: () => [OrderGroupPermissionInput], nullable: true }) order?: OrderGroupPermissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<GroupPermission[]> {
        this.logger.verbose("findManyGroupPermission resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).GroupPermission, filter]
              }
            : accessibleBy(ctx.req.permissions).GroupPermission;

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

    @Query(() => GroupPermission, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: GroupPermission)")
    async findOneGroupPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<GroupPermission> {
        this.logger.verbose("findOneGroupPermission resolver called");
        return ctx.req.prismaTx.groupPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).GroupPermission]
            }
        });
    }

    @Mutation(() => GroupPermission, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: GroupPermission)")
    async createGroupPermission(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateGroupPermissionInput }) input: CreateGroupPermissionInput
    ): Promise<GroupPermission> {
        this.logger.verbose("createGroupPermission resolver called");
        input = plainToClass(CreateGroupPermissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.groupPermission.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "GroupPermission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => GroupPermission, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: GroupPermission)")
    async updateGroupPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateGroupPermissionInput }) input: UpdateGroupPermissionInput
    ): Promise<GroupPermission> {
        this.logger.verbose("updateGroupPermission resolver called");
        input = plainToClass(UpdateGroupPermissionInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.groupPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).GroupPermission]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("GroupPermission not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("GroupPermission", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.groupPermission.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "GroupPermission",
            id: result.id
        });

        return result;
    }

    @Mutation(() => GroupPermission, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: GroupPermission)")
    async deleteGroupPermission(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<GroupPermission> {
        this.logger.verbose("deleteGroupPermission resolver called");

        const rowToDelete = await ctx.req.prismaTx.groupPermission.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).GroupPermission]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("GroupPermission not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("GroupPermission", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.groupPermission.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "GroupPermission",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: GroupPermission)")
    async groupPermissionCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterGroupPermissionInput, nullable: true }) filter?: FilterGroupPermissionInput
    ): Promise<number> {
        return ctx.req.prismaTx.groupPermission.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).GroupPermission, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Group corresponding to the GroupPermission's {@link GroupPermission#groupId}.
     */
    @ResolveField(() => Group, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Group)")
    async group(@Context() ctx: { req: Request }, @Parent() groupPermission: GroupPermission): Promise<Group> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!groupPermission.groupId || groupPermission["group"] === null) {
            return null;
        }
        return ctx.req.prismaTx.group.findFirst({
            where: { id: groupPermission.groupId }
        });
    }
}
