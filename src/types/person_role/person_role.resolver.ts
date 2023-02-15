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
import { PersonRole } from "./person_role.entity";
import { FilterPersonRoleInput } from "./dto/filter-person_role.input";
import { OrderPersonRoleInput } from "./dto/order-person_role.input";
import { CreatePersonRoleInput } from "./dto/create-person_role.input";
import { UpdatePersonRoleInput } from "./dto/update-person_role.input";
import { Person } from "../person/person.entity";
import { Role } from "../role/role.entity";

@Resolver(() => PersonRole)
export class PersonRoleResolver {
    private logger: Logger = new Logger("PersonRoleResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [PersonRole], { complexity: Complexities.ReadMany })
    @Directive("@rule(ruleType: ReadMany, subject: PersonRole)")
    async findManyPersonRole(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonRoleInput, nullable: true }) filter?: FilterPersonRoleInput,
        @Args("order", { type: () => [OrderPersonRoleInput], nullable: true }) order?: OrderPersonRoleInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<PersonRole[]> {
        this.logger.verbose("findManyPersonRole resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).PersonRole, filter]
              }
            : accessibleBy(ctx.req.permissions).PersonRole;

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

    @Query(() => PersonRole, { nullable: true, complexity: Complexities.ReadOne })
    @Directive("@rule(ruleType: ReadOne, subject: PersonRole)")
    async findOnePersonRole(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
    ): Promise<PersonRole> {
        this.logger.verbose("findOnePersonRole resolver called");
        return ctx.req.prismaTx.personRole.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonRole]
            }
        });
    }

    @Mutation(() => PersonRole, { complexity: Complexities.Create })
    @Directive("@rule(ruleType: Create, subject: PersonRole)")
    async createPersonRole(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreatePersonRoleInput }) input: CreatePersonRoleInput
    ): Promise<PersonRole> {
        this.logger.verbose("createPersonRole resolver called");
        input = plainToClass(CreatePersonRoleInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.personRole.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "PersonRole",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonRole, { complexity: Complexities.Update })
    @Directive("@rule(ruleType: Update, subject: PersonRole)")
    async updatePersonRole(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number,
        @Args("input", { type: () => UpdatePersonRoleInput }) input: UpdatePersonRoleInput
    ): Promise<PersonRole> {
        this.logger.verbose("updatePersonRole resolver called");
        input = plainToClass(UpdatePersonRoleInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.personRole.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonRole]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("PersonRole not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("PersonRole", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.personRole.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "PersonRole",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonRole, { complexity: Complexities.Delete })
    @Directive("@rule(ruleType: Delete, subject: PersonRole)")
    async deletePersonRole(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => ID }) id: number
    ): Promise<PersonRole> {
        this.logger.verbose("deletePersonRole resolver called");

        const rowToDelete = await ctx.req.prismaTx.personRole.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonRole]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("PersonRole not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("PersonRole", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.personRole.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "PersonRole",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Directive("@rule(ruleType: Count, subject: PersonRole)")
    async personRoleCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonRoleInput, nullable: true }) filter?: FilterPersonRoleInput
    ): Promise<number> {
        return ctx.req.prismaTx.personRole.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the PersonRole's {@link PersonRole#personId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Person)")
    async person(@Context() ctx: { req: Request }, @Parent() personRole: PersonRole): Promise<Person> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!personRole.personId || personRole["person"] === null) {
            return null;
        }
        return ctx.req.prismaTx.person.findFirst({
            where: { id: personRole.personId }
        });
    }

    /**
     * Virtual field resolver for the Role corresponding to the PersonRole's {@link PersonRole#roleId}.
     */
    @ResolveField(() => Role, { nullable: true })
    @Directive("@rule(ruleType: ReadOne, subject: Role)")
    async role(@Context() ctx: { req: Request }, @Parent() personRole: PersonRole): Promise<Role> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!personRole.roleId || personRole["role"] === null) {
            return null;
        }
        return ctx.req.prismaTx.role.findFirst({
            where: { id: personRole.roleId }
        });
    }
}
