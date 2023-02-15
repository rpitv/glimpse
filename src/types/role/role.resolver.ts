import {Resolver, Query, Mutation, Args, Int, Context, Directive, ResolveField, Parent, ID} from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { Role } from "./role.entity";
import { FilterRoleInput } from "./dto/filter-role.input";
import { OrderRoleInput } from "./dto/order-role.input";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { PersonRole } from "../person_role/person_role.entity";
import { FilterPersonRoleInput } from "../person_role/dto/filter-person_role.input";
import { OrderPersonRoleInput } from "../person_role/dto/order-person_role.input";

@Resolver(() => Role)
export class RoleResolver {
    private logger: Logger = new Logger("RoleResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [Role], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: Role)")
    async findManyRole(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterRoleInput, nullable: true }) filter?: FilterRoleInput,
        @Args("order", { type: () => [OrderRoleInput], nullable: true }) order?: OrderRoleInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<Role[]> {
        this.logger.verbose("findManyRole resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).Role, filter]
              }
            : accessibleBy(ctx.req.permissions).Role;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.role.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }

    @Query(() => Role, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: Role)")
    async findOneRole(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<Role> {
        this.logger.verbose("findOneRole resolver called");
        return ctx.req.prismaTx.role.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Role]
            }
        });
    }

    @Mutation(() => Role, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: Role)")
    async createRole(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateRoleInput }) input: CreateRoleInput
    ): Promise<Role> {
        this.logger.verbose("createRole resolver called");
        input = plainToClass(CreateRoleInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.role.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "Role",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Role, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: Role)")
    async updateRole(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
        @Args("input", { type: () => UpdateRoleInput }) input: UpdateRoleInput
    ): Promise<Role> {
        this.logger.verbose("updateRole resolver called");
        input = plainToClass(UpdateRoleInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.role.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Role]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("Role not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("Role", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.role.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "Role",
            id: result.id
        });

        return result;
    }

    @Mutation(() => Role, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: Role)")
    async deleteRole(@Context() ctx: { req: Request }, @Args("id", { type: () => ID }) id: number): Promise<Role> {
        this.logger.verbose("deleteRole resolver called");

        const rowToDelete = await ctx.req.prismaTx.role.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).Role]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("Role not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("Role", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.role.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "Role",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: Role)")
    async roleCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterRoleInput, nullable: true }) filter?: FilterRoleInput
    ): Promise<number> {
        return ctx.req.prismaTx.role.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for all PersonRoles which have this Role as their {@link PersonRole#roleId}.
     */
    @ResolveField(() => [PersonRole], { nullable: true })
    @Directive("@rule(ruleType: ReadMany, subject: PersonRole)")
    async people(
        @Context() ctx: { req: Request },
        @Parent() role: Role,
        @Args("filter", { type: () => FilterPersonRoleInput, nullable: true }) filter?: FilterPersonRoleInput,
        @Args("order", { type: () => [OrderPersonRoleInput], nullable: true }) order?: OrderPersonRoleInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonRole[]> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (role["people"] === null) {
            return null;
        }
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? { AND: [accessibleBy(ctx.req.permissions).PersonRole, { roleId: role.id }, filter] }
            : { AND: [accessibleBy(ctx.req.permissions).PersonRole, { roleId: role.id }] };

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;
        return ctx.req.prismaTx.personRole.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: pagination.cursor } : undefined
        });
    }
}
