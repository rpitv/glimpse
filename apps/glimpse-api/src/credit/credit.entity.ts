import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, MaxLength, Min } from "class-validator";
import { Credit as PrismaCredit } from "@prisma/client";

@ObjectType()
export class Credit implements PrismaCredit {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Credit" is passed to CASL's
     *   can() method, and the passed Credit object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Credit" as const;

    /**
     * Unique ID for this blog post. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The title of this Credit
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    title: string | null;

    /**
     * The priority of this Credit. Credits with a higher priority should be displayed first.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;

    /**
     * The ID of the person this Credit belongs to.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    personId: number | null;

    /**
     * The ID of the production this Credit is for.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    productionId: number | null;
}
