import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsInt, MaxLength } from "class-validator";
import { Category as PrismaCategory } from "@prisma/client";
import { BigIntMin } from "../../custom-validators";
import { GraphQLBigInt } from "graphql-scalars";

@ObjectType()
export class Category implements PrismaCategory {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Category" is passed to CASL's
     *   can() method, and the passed Category object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Category" as const;

    /**
     * Unique ID for this category. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The name of this category
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The priority of this category. Categories with a higher priority should be displayed first.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;

    /**
     * The ID of the parent category, or null if this is a top-level category.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    parentId: bigint | null;
}
