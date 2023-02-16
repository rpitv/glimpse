import { Field, ObjectType } from "@nestjs/graphql";
import { ProductionTag as PrismaProductionTag } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

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
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the Production that this tag is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    productionId: bigint | null;

    /**
     * This tag's value.
     */
    @Field(() => String, { nullable: true })
    tag: string | null;
}
