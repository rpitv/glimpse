import {Field, Int, ObjectType} from "@nestjs/graphql";
import {IsInt} from "class-validator";
import {ProductionImage as PrismaProductionImage} from "@prisma/client";
import {GraphQLBigInt} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

@ObjectType()
export class ProductionImage implements PrismaProductionImage {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ProductionImage" is passed to CASL's
     *   can() method, and the passed ProductionImage object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ProductionImage" as const;

    /**
     * Unique ID for this ProductionImage. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the production this ProductionImage is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    productionId: bigint | null;

    /**
     * ID of the image this ProductionImage is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    imageId: bigint | null;

    /**
     * The priority of this ProductionImage. Higher priority ProductionImages should appear before lower priority ones.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;
}
