import { Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent, ID } from "@nestjs/graphql";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger, Session } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { FilterUserInput } from "./dto/filter-user.input";
import { OrderUserInput } from "./dto/order-user.input";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AuthService } from "../../auth/auth.service";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Person } from "../person/person.entity";
import { AccessLog } from "../access_log/access_log.entity";
import { FilterAccessLogInput } from "../access_log/dto/filter-access_log.input";
import { OrderAccessLogInput } from "../access_log/dto/order-access_log.input";
import { FilterAssetInput } from "../asset/dto/filter-asset.input";
import { OrderAssetInput } from "../asset/dto/order-asset.input";
import { Asset } from "../asset/asset.entity";
import { AuditLog } from "../audit_log/audit_log.entity";
import { FilterAuditLogInput } from "../audit_log/dto/filter-audit_log.input";
import { OrderAuditLogInput } from "../audit_log/dto/order-audit_log.input";
import { ProductionRSVP } from "../production_rsvp/production_rsvp.entity";
import { FilterProductionRSVPInput } from "../production_rsvp/dto/filter-production_rsvp.input";
import { OrderProductionRSVPInput } from "../production_rsvp/dto/order-production_rsvp.input";
import { UserGroup } from "../user_group/user_group.entity";
import { FilterUserGroupInput } from "../user_group/dto/filter-user_group.input";
import { UserPermission } from "../user_permission/user_permission.entity";
import { FilterUserPermissionInput } from "../user_permission/dto/filter-user_permission.input";
import { OrderUserPermissionInput } from "../user_permission/dto/order-user_permission.input";
import { VoteResponse } from "../vote_response/vote_response.entity";
import { FilterVoteResponseInput } from "../vote_response/dto/filter-vote_response.input";
import { OrderVoteResponseInput } from "../vote_response/dto/order-vote_response.input";

@Resolver(() => User)
export class UserResolver {
    private logger: Logger = new Logger("UserResolver");

    constructor(private readonly authService: AuthService) {}

    // -------------------- Generic Resolvers --------------------

    @Query(() => [User], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: User)")
    async findManyUser(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput,
        @Args("order", { type: () => [OrderUserInput], nullable: true }) order?: OrderUserInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<User[]> {
        this.logger.verbose("findManyUser resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).User, filter]
              }
            : accessibleBy(ctx.req.permissions).User;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.user.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => User, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: User)")
    async findOneUser(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<User> {
        this.logger.verbose("findOneUser resolver called");
        return ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });
    }

    @Mutation(() => User, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: User)")
    async createUser(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateUserInput }) input: CreateUserInput
    ): Promise<User> {
        this.logger.verbose("createUser resolver called");
        input = plainToClass(CreateUserInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        // Hash the password if it is provided.
        if (input.password) {
            input.password = await this.authService.hashPassword(input.password);
        }

        const result = await ctx.req.prismaTx.user.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    @Mutation(() => User, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: User)")
    async updateUser(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
        @Args("input", { type: () => UpdateUserInput }) input: UpdateUserInput
    ): Promise<User> {
        this.logger.verbose("updateUser resolver called");
        input = plainToClass(UpdateUserInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("User", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        // Hash the password if it is provided.
        if (input.password) {
            input.password = await this.authService.hashPassword(input.password);
        }

        const result = await ctx.req.prismaTx.user.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    @Mutation(() => User, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: User)")
    async deleteUser(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<User> {
        this.logger.verbose("deleteUser resolver called");

        const rowToDelete = await ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("User", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.user.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "User",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: User)")
    async userCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput
    ): Promise<number> {
        return ctx.req.prismaTx.user.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).User, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the User's {@link User#personId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Person)")
    async person(@Context() ctx: { req: Request }, @Parent() user: User): Promise<Person> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!user.personId || user["person"] === null) {
            return null;
        }
        return ctx.req.prismaTx.person.findFirst({
            where: { id: user.personId }
        });
    }

    /**
     * Virtual field resolver for all AccessLogs which have this User as their {@link AccessLog#userId}.
     */
    @ResolveField(() => [AccessLog], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: AccessLog)")
    async accessLogs(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterAccessLogInput, nullable: true }) filter?: FilterAccessLogInput,
        @Args("order", { type: () => [OrderAccessLogInput], nullable: true }) order?: OrderAccessLogInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<AccessLog[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["accessLogs"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).AccessLog, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).AccessLog, { userId: user.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.accessLog.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all Assets which have this User as their {@link Asset#lastKnownHandlerId}.
     */
    @ResolveField(() => [Asset], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: Asset)")
    async checkedOutAssets(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterAssetInput, nullable: true }) filter?: FilterAssetInput,
        @Args("order", { type: () => [OrderAssetInput], nullable: true }) order?: OrderAssetInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Asset[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["checkedOutAssets"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).Asset, { lastKnownHandlerId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).Asset, { lastKnownHandlerId: user.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.asset.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all AuditLogs which have this User as their {@link AuditLog#userId}.
     */
    @ResolveField(() => [AuditLog], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: AuditLog)")
    async auditLogs(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterAuditLogInput, nullable: true }) filter?: FilterAuditLogInput,
        @Args("order", { type: () => [OrderAuditLogInput], nullable: true }) order?: OrderAuditLogInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<AuditLog[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["auditLogs"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).AuditLog, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).AuditLog, { userId: user.id }] };

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

    /**
     * Virtual field resolver for all ProductionRSVPs which have this User as their {@link ProductionRSVP#userId}.
     */
    @ResolveField(() => [ProductionRSVP], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: ProductionRSVP)")
    async productionRsvps(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterProductionRSVPInput, nullable: true }) filter?: FilterProductionRSVPInput,
        @Args("order", { type: () => [OrderProductionRSVPInput], nullable: true }) order?: OrderProductionRSVPInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<ProductionRSVP[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["productionRsvps"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).ProductionRSVP, { userId: user.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.productionRSVP.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all UserGroups which have this User as their {@link UserGroup#userId}.
     */
    @ResolveField(() => [UserGroup], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: UserGroup)")
    async groups(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterUserGroupInput, nullable: true }) filter?: FilterUserGroupInput,
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<UserGroup[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["groups"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).UserGroup, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).UserGroup, { userId: user.id }] };

        return ctx.req.prismaTx.userGroup.findMany({
            where,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    /**
     * Virtual field resolver for all UserPermissions which have this User as their {@link UserPermission#userId}.
     *  Note, this does NOT include permissions the user has inherited via groups. To get those, use the
     *  Query.permissionsFor resolver.
     */
    @ResolveField(() => [UserPermission], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: UserPermission)")
    async permissions(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterUserPermissionInput, nullable: true }) filter?: FilterUserPermissionInput,
        @Args("order", { type: () => [OrderUserPermissionInput], nullable: true }) order?: OrderUserPermissionInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<UserPermission[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["permissions"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).UserPermission, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).UserPermission, { userId: user.id }] };

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

    /**
     * Virtual field resolver for all VoteResponses which have this User as their {@link VoteResponse#userId}.
     */
    @ResolveField(() => [VoteResponse], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: VoteResponse)")
    async voteResponses(
        @Context() ctx: { req: Request },
        @Parent() user: User,
        @Args("filter", { type: () => FilterVoteResponseInput, nullable: true }) filter?: FilterVoteResponseInput,
        @Args("order", { type: () => [OrderVoteResponseInput], nullable: true }) order?: OrderVoteResponseInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<VoteResponse[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (user["voteResponses"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).VoteResponse, { userId: user.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).VoteResponse, { userId: user.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.voteResponse.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    // -------------------- Custom Resolvers --------------------

    @Query(() => User, { nullable: true, complexity: Complexities.ReadOne })
    @Directive('@rule(ruleType: ReadOne, subject: User, options: { name: "Read self" })')
    async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User | null> {
        this.logger.verbose("self resolver called");
        return ctx.req.user || null;
    }
}
