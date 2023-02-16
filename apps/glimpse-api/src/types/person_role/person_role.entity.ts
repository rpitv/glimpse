import { Field, ObjectType } from "@nestjs/graphql";
import { IsDate } from "class-validator";
import { PersonRole as PrismaPersonRole } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class PersonRole implements PrismaPersonRole {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "PersonRole" is passed to CASL's
     *   can() method, and the passed PersonRole object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "PersonRole" as const;

    /**
     * Unique ID for this PersonRole. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the person this PersonRole is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    personId: bigint | null;

    /**
     * ID of the role this PersonRole is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    roleId: bigint | null;

    /**
     * Start date of when this PersonRole association should begin.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    startTime: Date | null;

    /**
     * End date of when this PersonRole association should no longer be active.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    endTime: Date | null;
}
