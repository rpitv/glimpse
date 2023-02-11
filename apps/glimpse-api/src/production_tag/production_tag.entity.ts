import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, Min } from "class-validator";
import { ProductionTag as PrismaProductionTag } from "@prisma/client";

@ObjectType()
export class ProductionTag implements PrismaProductionTag {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "ProductionTag" is passed to CASL's
     *   can() method, and the passed ProductionTag object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "ProductionTag" as const;

    /**
     * Unique ID for this ProductionTag. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the Production that this tag is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    productionId: number | null;

    /**
     * This tag's value.
     */
    @Field(() => String, { nullable: true })
    tag: string | null;
}
