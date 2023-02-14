import {
    Args,
    ComplexityEstimatorArgs,
    Context,
    createUnionType,
    Directive,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver
} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction, CaslAbilityFactory } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { UserPermission } from "./user_permission.entity";
import { FilterUserPermissionInput } from "./dto/filter-user_permission.input";
import { OrderUserPermissionInput } from "./dto/order-user_permission.input";
import { CreateUserPermissionInput } from "./dto/create-user_permission.input";
import { UpdateUserPermissionInput } from "./dto/update-user_permission.input";
import { User } from "../user/user.entity";
import { GroupPermission } from "../group_permission/group_permission.entity";

const PermissionUnion = createUnionType({
    name: "Permission",
    types: () => [UserPermission, GroupPermission],
    resolveType: (value) => {
        if ("userId" in value) {
            return UserPermission;
        }
        if ("groupId" in value) {
            return GroupPermission;
        }
        return undefined;
    }
});

@Resolver(() => UserPermission)
export class UserPermissionResolver {
    private logger: Logger = new Logger("UserPermissionResolver");

    constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

    // -------------------- Generic Resolvers --------------------

    @Query(() => [UserPermission], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: UserPermission)")
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
    @Directive("@rule(ruleType: ReadOne, subject: UserPermission)")
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
    @Directive("@rule(ruleType: Create, subject: UserPermission)")
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
    @Directive("@rule(ruleType: Update, subject: UserPermission)")
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
    @Directive("@rule(ruleType: Delete, subject: UserPermission)")
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
    @Directive("@rule(ruleType: Count, subject: UserPermission)")
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

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the User corresponding to the UserPermission's {@link UserPermission#userId}.
     */
    @ResolveField(() => User, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: User)")
    async user(@Context() ctx: { req: Request }, @Parent() userPermission: UserPermission): Promise<User> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!userPermission.userId || userPermission["user"] === null) {
            return null;
        }
        return ctx.req.prismaTx.user.findFirst({
            where: { id: userPermission.userId }
        });
    }

    // -------------------- Special Resolvers --------------------

    // TODO
    @Query(() => [PermissionUnion], {
        nullable: true,
        complexity: (options: ComplexityEstimatorArgs) => 50 + options.childComplexity
    })
    @Directive('@custom_rule(name: "permissionsFor", options: { name: "Permissions for user" })')
    async permissionsFor(
        @Context() ctx: { req: Request },
        @Args("userId", { type: () => Int, nullable: true }) userId: number
    ): Promise<(typeof PermissionUnion)[] | null> {
        this.logger.verbose("permissionsFor resolver called");
        let user = null;
        if (userId !== null) {
            user = await ctx.req.prismaTx.user.findFirst({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new BadRequestException("User not found");
            }
        }
        return await this.caslAbilityFactory.getPermissions(user);
    }
}
