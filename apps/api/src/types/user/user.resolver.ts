import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { Logger, Session } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import { FilterUserInput } from "./dto/filter-user.input";
import { OrderUserInput } from "./dto/order-user.input";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
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
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
    private logger: Logger = new Logger("UserResolver");

    constructor(private readonly userService: UserService) {}

    // -------------------- Generic Resolvers --------------------

    @Query(() => [User], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, User)
    async findManyUser(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput,
        @Args("order", { type: () => [OrderUserInput], nullable: true }) order?: OrderUserInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<User[]> {
        this.logger.verbose("findManyUser resolver called");
        return this.userService.findManyUser(ctx.req.prismaTx, { filter, order, pagination }, ctx);
    }

    @Query(() => User, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, User)
    async findOneUser(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<User> {
        this.logger.verbose("findOneUser resolver called");
        return this.userService.findOneUser(id, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => User, { complexity: Complexities.Create })
    @Rule(RuleType.Create, User)
    async createUser(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateUserInput }) input: CreateUserInput
    ): Promise<User> {
        this.logger.verbose("createUser resolver called");
        return this.userService.createUser(input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => User, { complexity: Complexities.Update })
    @Rule(RuleType.Update, User)
    async updateUser(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateUserInput }) input: UpdateUserInput
    ): Promise<User> {
        this.logger.verbose("updateUser resolver called");
        return this.userService.updateUser(id, input, ctx.req.prismaTx, ctx);
    }

    @Mutation(() => User, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, User)
    async deleteUser(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<User> {
        this.logger.verbose("deleteUser resolver called");
        return this.userService.deleteUser(id, ctx.req.prismaTx, ctx);
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, User)
    async userCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterUserInput, nullable: true }) filter?: FilterUserInput
    ): Promise<number> {
        this.logger.verbose("userCount resolver called");
        return this.userService.userCount(ctx.req.prismaTx, { filter }, ctx);
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the User's {@link User#personId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Rule(RuleType.ReadOne, Person)
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
    @Rule(RuleType.ReadMany, AccessLog)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all Assets which have this User as their {@link Asset#lastKnownHandlerId}.
     */
    @ResolveField(() => [Asset], { nullable: true })
    @Rule(RuleType.ReadMany, Asset)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all AuditLogs which have this User as their {@link AuditLog#userId}.
     */
    @ResolveField(() => [AuditLog], { nullable: true })
    @Rule(RuleType.ReadMany, AuditLog)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all ProductionRSVPs which have this User as their {@link ProductionRSVP#userId}.
     */
    @ResolveField(() => [ProductionRSVP], { nullable: true })
    @Rule(RuleType.ReadMany, ProductionRSVP)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all UserGroups which have this User as their {@link UserGroup#userId}.
     */
    @ResolveField(() => [UserGroup], { nullable: true })
    @Rule(RuleType.ReadMany, UserGroup)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all UserPermissions which have this User as their {@link UserPermission#userId}.
     *  Note, this does NOT include permissions the user has inherited via groups. To get those, use the
     *  Query.permissionsFor resolver.
     */
    @ResolveField(() => [UserPermission], { nullable: true })
    @Rule(RuleType.ReadMany, UserPermission)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    /**
     * Virtual field resolver for all VoteResponses which have this User as their {@link VoteResponse#userId}.
     */
    @ResolveField(() => [VoteResponse], { nullable: true })
    @Rule(RuleType.ReadMany, VoteResponse)
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
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    // -------------------- Custom Resolvers --------------------

    @Query(() => User, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, User, { name: "Read self", defer: true })
    async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User | null> {
        this.logger.verbose("self resolver called");
        return ctx.req.user || null;
    }
}
