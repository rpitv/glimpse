import { ObjectType, Field, ID } from "@nestjs/graphql";
import { IsInt, IsObject, MaxLength, Min } from "class-validator";
import { Prisma, Video as PrismaVideo } from "@prisma/client";
import JSON from "graphql-type-json";

@ObjectType()
export class Video implements PrismaVideo {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Video" is passed to CASL's
     *   can() method, and the passed Video object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Video" as const;

    /**
     * Unique ID for this Video. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * The display name for this Video.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The format for this Video. Probably either "EMBED", "RTMP", or "HLS".
     */
    @MaxLength(32)
    @Field(() => String, { nullable: true })
    format: string | null;

    /**
     * All additional data about this video. This is an unstructured JSON object. The data will vary depending on the
     *  format of the video.
     */
    @IsObject()
    @Field(() => JSON, { nullable: true })
    metadata: Prisma.JsonValue | null;
}
