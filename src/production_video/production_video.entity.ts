import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, Min } from "class-validator";
import { ProductionVideo as PrismaProductionVideo } from "@prisma/client";

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
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the person this ProductionVideo is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    productionId: number | null;

    /**
     * ID of the video this ProductionVideo is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    videoId: number | null;

    /**
     * The priority of this ProductionVideo. Higher priority ProductionVideos should appear before lower priority ones.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;
}
