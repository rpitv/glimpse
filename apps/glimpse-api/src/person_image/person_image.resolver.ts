import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { Rule, RuleType } from "../casl/rules.decorator";
import { accessibleBy } from "@casl/prisma";
import { Complexities } from "../gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { PersonImage } from "./person_image.entity";
import { FilterPersonImageInput } from "./dto/filter-person_image.input";
import { CreatePersonImageInput } from "./dto/create-person_image.input";
import { UpdatePersonImageInput } from "./dto/update-person_image.input";

@Resolver(() => PersonImage)
export class PersonImageResolver {
    private logger: Logger = new Logger("PersonImageResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => PersonImage, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, PersonImage)
    async findOnePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<PersonImage> {
        this.logger.verbose("findOnePersonImage resolver called");
        return ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Create })
    @Rule(RuleType.Create, PersonImage)
    async createPersonImage(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreatePersonImageInput }) input: CreatePersonImageInput
    ): Promise<PersonImage> {
        this.logger.verbose("createPersonImage resolver called");
        input = plainToClass(CreatePersonImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.personImage.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Update })
    @Rule(RuleType.Update, PersonImage)
    async updatePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number,
        @Args("input", { type: () => UpdatePersonImageInput }) input: UpdatePersonImageInput
    ): Promise<PersonImage> {
        this.logger.verbose("updatePersonImage resolver called");
        input = plainToClass(UpdatePersonImageInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("PersonImage not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("PersonImage", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.personImage.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Mutation(() => PersonImage, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, PersonImage)
    async deletePersonImage(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => Int }) id: number
    ): Promise<PersonImage> {
        this.logger.verbose("deletePersonImage resolver called");

        const rowToDelete = await ctx.req.prismaTx.personImage.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).PersonImage]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("PersonImage not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("PersonImage", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.personImage.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "PersonImage",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, PersonImage)
    async personImageCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterPersonImageInput, nullable: true }) filter?: FilterPersonImageInput
    ): Promise<number> {
        return ctx.req.prismaTx.personImage.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).Credit, filter]
            }
        });
    }
}
