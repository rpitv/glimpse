import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { Production as PrismaProduction } from "@prisma/client";

@ObjectType()
export class Production implements PrismaProduction {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Production" is passed to CASL's
     *   can() method, and the passed Production object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Production" as const;

    /**
     * Unique ID for this Production. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The title/name of this Production
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The Description of this Production
     */
    @Field(() => String, { nullable: true })
    description: string | null;

    /**
     * The expected start time of this Production. This is used, in combination with end time, to determine which
     *  Productions are live.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    startTime: Date | null;

    /**
     * The expected end time of this Production. This is used, in combination with start time, to determine which
     *  Productions are live.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    endTime: Date | null;

    /**
     * The ID of the category which this Production belongs to.
     */
    @IsInt()
    @Min(0)
    @Field(() => Int, { nullable: true })
    categoryId: number | null;

    /**
     * The closet meeting location for club members to meet at before the Production.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    closetLocation: string | null;

    /**
     * The time that club members should meet at the closet location before the Production.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    closetTime: Date | null;

    /**
     * The location of the event for this Production.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    eventLocation: string | null;

    /**
     * Any notes that the team has about this Production. Can be markup.
     */
    @Field(() => String, { nullable: true })
    teamNotes: string | null;

    /**
     * The ID of the Discord server that messages related to this Production should be sent to.
     */
    @MaxLength(18)
    @Field(() => String, { nullable: true })
    discordServer: string | null;

    /**
     * The ID of the Discord channel within the Discord server that messages related to this Production should be sent
     *  to.
     */
    @MaxLength(18)
    @Field(() => String, { nullable: true })
    discordChannel: string | null;

    /**
     * The ID of the Image which should be used as the thumbnail for this Production.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    thumbnailId: number | null;
}
