import { Resolver, Query, Mutation, Args, Int, Context, Directive } from "@nestjs/graphql";
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
    async findOneUser(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<User> {
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
        @Args("id", { type: () => Int }) id: number,
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
    async deleteUser(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<User> {
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

    // -------------------- Unique Resolvers --------------------

    @Query(() => User, { nullable: true, complexity: Complexities.ReadOne })
    @Directive('@rule(ruleType: ReadOne, subject: User, options: { name: "Read self" })')
    async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User | null> {
        this.logger.verbose("self resolver called");
        return ctx.req.user || null;
    }
}
