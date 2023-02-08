import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger, Session } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import { FilterUserInput } from "./dto/filter-user.input";
import { OrderUserInput } from "./dto/order-user.input";
import PaginationInput from "../generic/pagination.input";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AuthService } from "../auth/auth.service";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";

@Resolver(() => User)
export class UserResolver {
    private logger: Logger = new Logger("UserResolver");

    constructor(private readonly authService: AuthService) {}

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
    @Rule(RuleType.ReadOne, User)
    async findOneUser(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<User> {
        this.logger.verbose("findOneUser resolver called");
        return ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });
    }

    @Mutation(() => User, { complexity: Complexities.Create })
    @Rule(RuleType.Create, User)
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

        return ctx.req.prismaTx.user.create({
            data: input
        });
    }

    @Mutation(() => User, { complexity: Complexities.Update })
    @Rule(RuleType.Update, User)
    async updateUser(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdateUserInput }) input: UpdateUserInput
    ): Promise<User> {
        this.logger.verbose("updateUser resolver called");
        input = plainToClass(CreateUserInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const userToUpdate = await ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });

        if (!userToUpdate) {
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("User", userToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        // Hash the password if it is provided.
        if (input.password) {
            input.password = await this.authService.hashPassword(input.password);
        }

        return ctx.req.prismaTx.user.update({
            where: {
                id
            },
            data: input
        });
    }

    @Mutation(() => User, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, User)
    async deleteUser(@Context() ctx: { req: Request }, @Args("id", { type: () => Int }) id: number): Promise<User> {
        this.logger.verbose("deleteUser resolver called");

        const userToDelete = await ctx.req.prismaTx.user.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).User]
            }
        });

        if (!userToDelete) {
            throw new BadRequestException("User not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("User", userToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        return ctx.req.prismaTx.user.delete({
            where: {
                id
            }
        });
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, User)
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
    @Rule(RuleType.ReadOne, User, { name: "Read one user (self)" })
    async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User | null> {
        this.logger.verbose("self resolver called");
        return ctx.req.user || null;
    }
}
