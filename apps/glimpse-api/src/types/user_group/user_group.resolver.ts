import { Resolver, Query, Mutation, Args, Int, Context, Directive } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { UserGroup } from "./user_group.entity";
import { FilterUserGroupInput } from "./dto/filter-user_group.input";
import { CreateUserGroupInput } from "./dto/create-user_group.input";

@Resolver(() => UserGroup)
export class UserGroupResolver {
    private logger: Logger = new Logger("UserGroupResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => UserGroup, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: UserGroup)")
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
    @Directive("@rule(ruleType: Create, subject: UserGroup)")
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

    @Mutation(() => UserGroup, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: UserGroup)")
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
    @Directive("@rule(ruleType: Count, subject: UserGroup)")
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
