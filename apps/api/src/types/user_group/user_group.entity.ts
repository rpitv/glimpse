import { Field, ObjectType } from "@nestjs/graphql";
import { UserGroup as PrismaUserGroup } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class UserGroup implements PrismaUserGroup {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "UserGroup" is passed to CASL's
     *   can() method, and the passed UserGroup object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "UserGroup" as const;

    /**
     * Unique ID for this UserGroup. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the user this UserGroup is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    userId: bigint | null;

    /**
     * ID of the group this UserGroup is associated with.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    groupId: bigint | null;
}
