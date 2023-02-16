import {Field, Int, ObjectType} from "@nestjs/graphql";
import {IsInt, MaxLength} from "class-validator";
import {Credit as PrismaCredit} from "@prisma/client";
import {GraphQLBigInt} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

@ObjectType()
export class Credit implements PrismaCredit {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Credit" is passed to CASL's
     *   can() method, and the passed Credit object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Credit" as const;

    /**
     * Unique ID for this Credit. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The title of this Credit
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    title: string | null;

    /**
     * The priority of this Credit. Credits with a higher priority should be displayed first.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;

    /**
     * The ID of the person this Credit belongs to.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    personId: bigint | null;

    /**
     * The ID of the production this Credit is for.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    productionId: bigint | null;
}
