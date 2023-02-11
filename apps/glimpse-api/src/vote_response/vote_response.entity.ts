import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import {IsDate, IsInt, MaxLength, Min} from "class-validator";
import { VoteResponse as PrismaVoteResponse } from "@prisma/client";

@ObjectType()
export class VoteResponse implements PrismaVoteResponse {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "VoteResponse" is passed to CASL's
     *   can() method, and the passed VoteResponse object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "VoteResponse" as const;

    /**
     * Unique ID for this VoteResponse. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the user this VoteResponse is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    userId: number | null;

    /**
     * ID of the vote this VoteResponse is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    voteId: number | null;

    /**
     * Timestamp at which this VoteResponse was submitted.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    timestamp: Date | null;

    /**
     * The user's selection for this VoteResponse. If the vote's options are changed, this field will still remain
     *  unchanged unless the user updates their vote.
     */
    @MaxLength(200)
    @Field(() => String, { nullable: true })
    selection: string | null;
}
