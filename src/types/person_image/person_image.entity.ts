import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PersonImage as PrismaPersonImage } from "@prisma/client";
import { BigIntMin } from "../../custom-validators";
import { GraphQLBigInt } from "graphql-scalars";

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
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the person this PersonImage is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    personId: bigint | null;

    /**
     * ID of the image this PersonImage is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    imageId: bigint | null;

    /**
     * Priority of this PersonImage. Higher priority images should be displayed first.
     */
    @Field(() => Int, { nullable: true })
    priority: number | null;
}
