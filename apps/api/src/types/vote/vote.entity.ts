import { Field, ObjectType } from "@nestjs/graphql";
import { IsDate, MaxLength } from "class-validator";
import { Vote as PrismaVote } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class Vote implements PrismaVote {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Vote" is passed to CASL's
     *   can() method, and the passed Vote object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Vote" as const;

    /**
     * Unique ID for this Vote. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The question proposed in this vote.
     */
    @MaxLength(200)
    @Field(() => String, { nullable: true })
    question: string | null;

    /**
     * An array of available options for responses to this vote.
     */
    @MaxLength(200, { each: true })
    @Field(() => [String], { nullable: true })
    options: string[] | null;

    /**
     * Timestamp at which this vote closes and no more responses will be accepted.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    expires: Date | null;

    /**
     * Additional describing information about this vote.
     */
    @Field(() => String, { nullable: true })
    description: string | null;
}
