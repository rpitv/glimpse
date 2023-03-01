import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { BadRequestException, Logger } from "@nestjs/common";
import { accessibleBy } from "@casl/prisma";
import PaginationInput from "../../gql/pagination.input";
import { Complexities } from "../../gql/gql-complexity.plugin";
import { Request } from "express";
import { AbilityAction } from "../../casl/casl-ability.factory";
import { subject } from "@casl/ability";
import { BlogPost } from "./blog_post.entity";
import { FilterBlogPostInput } from "./dto/filter-blog_post.input";
import { OrderBlogPostInput } from "./dto/order-blog_post.input";
import { CreateBlogPostInput } from "./dto/create-blog_post.input";
import { UpdateBlogPostInput } from "./dto/update-blog_post.input";
import { Person } from "../person/person.entity";
import { GraphQLBigInt } from "graphql-scalars";
import { Rule, RuleType } from "../../casl/rule.decorator";

@Resolver(() => BlogPost)
export class BlogPostResolver {
    private logger: Logger = new Logger("BlogPostResolver");

    // -------------------- Generic Resolvers --------------------

    @Query(() => [BlogPost], { complexity: Complexities.ReadMany })
    @Rule(RuleType.ReadMany, BlogPost)
    async findManyBlogPost(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterBlogPostInput, nullable: true }) filter?: FilterBlogPostInput,
        @Args("order", { type: () => [OrderBlogPostInput], nullable: true }) order?: OrderBlogPostInput[],
        @Args("pagination", { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput
    ): Promise<BlogPost[]> {
        this.logger.verbose("findManyBlogPost resolver called");
        // If filter is provided, combine it with the CASL accessibleBy filter.
        const where = filter
            ? {
                  AND: [accessibleBy(ctx.req.permissions).BlogPost, filter]
              }
            : accessibleBy(ctx.req.permissions).BlogPost;

        // If ordering args are provided, convert them to Prisma's orderBy format.
        const orderBy = order?.map((o) => ({ [o.field]: o.direction })) || undefined;

        return ctx.req.prismaTx.blogPost.findMany({
            where,
            orderBy,
            skip: pagination?.skip,
            take: Math.max(0, pagination?.take ?? 20),
            cursor: pagination?.cursor ? { id: BigInt(pagination.cursor) } : undefined
        });
    }

    @Query(() => BlogPost, { nullable: true, complexity: Complexities.ReadOne })
    @Rule(RuleType.ReadOne, BlogPost)
    async findOneBlogPost(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<BlogPost> {
        this.logger.verbose("findOneBlogPost resolver called");
        return ctx.req.prismaTx.blogPost.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).BlogPost]
            }
        });
    }

    @Mutation(() => BlogPost, { complexity: Complexities.Create })
    @Rule(RuleType.Create, BlogPost)
    async createBlogPost(
        @Context() ctx: { req: Request },
        @Args("input", { type: () => CreateBlogPostInput }) input: CreateBlogPostInput
    ): Promise<BlogPost> {
        this.logger.verbose("createBlogPost resolver called");
        input = plainToClass(CreateBlogPostInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const result = await ctx.req.prismaTx.blogPost.create({
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            newValue: result,
            subject: "BlogPost",
            id: result.id
        });

        return result;
    }

    @Mutation(() => BlogPost, { complexity: Complexities.Update })
    @Rule(RuleType.Update, BlogPost)
    async updateBlogPost(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint,
        @Args("input", { type: () => UpdateBlogPostInput }) input: UpdateBlogPostInput
    ): Promise<BlogPost> {
        this.logger.verbose("updateBlogPost resolver called");
        input = plainToClass(UpdateBlogPostInput, input);
        const errors = await validate(input, { skipMissingProperties: true });
        if (errors.length > 0) {
            const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]];
            throw new BadRequestException(firstErrorFirstConstraint);
        }

        const rowToUpdate = await ctx.req.prismaTx.blogPost.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).BlogPost]
            }
        });

        if (!rowToUpdate) {
            throw new BadRequestException("BlogPost not found");
        }

        // Make sure the user has permission to update all the fields they are trying to update, given the object's
        //  current state.
        for (const field of Object.keys(input)) {
            if (!ctx.req.permissions.can(AbilityAction.Update, subject("BlogPost", rowToUpdate), field)) {
                ctx.req.passed = false;
                return null;
            }
        }

        const result = await ctx.req.prismaTx.blogPost.update({
            where: {
                id
            },
            data: input
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: rowToUpdate,
            newValue: result,
            subject: "BlogPost",
            id: result.id
        });

        return result;
    }

    @Mutation(() => BlogPost, { complexity: Complexities.Delete })
    @Rule(RuleType.Delete, BlogPost)
    async deleteBlogPost(
        @Context() ctx: { req: Request },
        @Args("id", { type: () => GraphQLBigInt }) id: bigint
    ): Promise<BlogPost> {
        this.logger.verbose("deleteBlogPost resolver called");

        const rowToDelete = await ctx.req.prismaTx.blogPost.findFirst({
            where: {
                AND: [{ id }, accessibleBy(ctx.req.permissions).BlogPost]
            }
        });

        if (!rowToDelete) {
            throw new BadRequestException("BlogPost not found");
        }

        // Make sure the user has permission to delete the object. Technically not required since the interceptor would
        //  handle this after the object has been deleted, but this saves an extra database call.
        if (!ctx.req.permissions.can(AbilityAction.Delete, subject("BlogPost", rowToDelete))) {
            ctx.req.passed = false;
            return null;
        }

        const result = await ctx.req.prismaTx.blogPost.delete({
            where: {
                id
            }
        });

        await ctx.req.prismaTx.genAuditLog({
            user: ctx.req.user,
            oldValue: result,
            subject: "BlogPost",
            id: result.id
        });

        return result;
    }

    @Query(() => Int, { complexity: Complexities.Count })
    @Rule(RuleType.Count, BlogPost)
    async blogPostCount(
        @Context() ctx: { req: Request },
        @Args("filter", { type: () => FilterBlogPostInput, nullable: true }) filter?: FilterBlogPostInput
    ): Promise<number> {
        return ctx.req.prismaTx.blogPost.count({
            where: {
                AND: [accessibleBy(ctx.req.permissions).BlogPost, filter]
            }
        });
    }

    // -------------------- Relation Resolvers --------------------

    /**
     * Virtual field resolver for the Person corresponding to the BlogPost's {@link BlogPost#authorId}.
     */
    @ResolveField(() => Person, { nullable: true })
    @Rule(RuleType.ReadOne, Person)
    async author(@Context() ctx: { req: Request }, @Parent() blogPost: BlogPost): Promise<Person> {
        // If this property is null, then the parent resolver explicitly set it to null because the user didn't have
        //  permission to read it, and strict mode was disabled. This is only guaranteed true for relational fields.
        //  An alternative solution would be to re-check the permissions for this field.
        if (!blogPost.authorId || blogPost["author"] === null) {
            return null;
        }
        return ctx.req.prismaTx.person.findFirst({
            where: { id: blogPost.authorId }
        });
    }
}
