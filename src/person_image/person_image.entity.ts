import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, Min } from "class-validator";
import { PersonImage as PrismaPersonImage } from "@prisma/client";

@ObjectType()
export class PersonImage implements PrismaPersonImage {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "PersonImage" is passed to CASL's
     *   can() method, and the passed PersonImage object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "PersonImage" as const;

    /**
     * Unique ID for this PersonImage. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the person this PersonImage is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    personId: number | null;

    /**
     * ID of the image this PersonImage is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    imageId: number | null;

    /**
     * Priority of this PersonImage. Higher priority images should be displayed first.
     */
    @Field(() => Int, { nullable: true })
    priority: number | null;
}
