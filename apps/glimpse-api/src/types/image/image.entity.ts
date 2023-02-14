import { ObjectType, Field, ID } from "@nestjs/graphql";
import { IsInt, MaxLength, Min } from "class-validator";
import { Image as PrismaImage } from "@prisma/client";

@ObjectType()
export class Image implements PrismaImage {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Image" is passed to CASL's
     *   can() method, and the passed Image object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Image" as const;

    /**
     * Unique ID for this Image. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: bigint | null;

    /**
     * The display name for this image.
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The description for this image.
     */
    @MaxLength(200)
    @Field(() => String, { nullable: true })
    description: string | null;

    /**
     * The path/URI for this image.
     */
    @MaxLength(1000)
    @Field(() => String, { nullable: true })
    path: string | null;
}
