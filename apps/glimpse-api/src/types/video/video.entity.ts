import {Field, ObjectType} from "@nestjs/graphql";
import {IsObject, MaxLength} from "class-validator";
import {Prisma, Video as PrismaVideo} from "@prisma/client";
import {GraphQLBigInt, GraphQLJSON} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

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
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

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
    @Field(() => GraphQLJSON, { nullable: true })
    metadata: Prisma.JsonValue | null;
}
