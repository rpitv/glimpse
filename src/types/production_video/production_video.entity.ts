import {Field, Int, ObjectType} from "@nestjs/graphql";
import {IsInt} from "class-validator";
import {ProductionVideo as PrismaProductionVideo} from "@prisma/client";
import {BigIntMin} from "../../custom-validators";
import {GraphQLBigInt} from "graphql-scalars";

@ObjectType()
export class ProductionVideo implements PrismaProductionVideo {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ProductionVideo" is passed to CASL's
     *   can() method, and the passed ProductionVideo object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ProductionVideo" as const;

    /**
     * Unique ID for this ProductionVideo. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the person this ProductionVideo is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    productionId: bigint | null;

    /**
     * ID of the video this ProductionVideo is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    videoId: bigint | null;

    /**
     * The priority of this ProductionVideo. Higher priority ProductionVideos should appear before lower priority ones.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;
}
