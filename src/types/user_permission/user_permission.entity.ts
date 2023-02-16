import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsObject, MaxLength } from "class-validator";
import { Prisma, UserPermission as PrismaUserPermission } from "@prisma/client";
import { GraphQLBigInt, GraphQLJSON } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class UserPermission implements PrismaUserPermission {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "UserPermission" is passed to CASL's
     *   can() method, and the passed UserPermission object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "UserPermission" as const;

    /**
     * Unique ID for this UserPermission. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * ID of the user which this UserPermission is for.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    userId: bigint | null;

    /**
     * The action for this UserPermission. Should be a valid action within {@link AbilityAction}.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    action: string | null;

    /**
     * The set of subjects for this UserPermission. Should be all valid subjects within {@link AbilitySubjects}.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(300, { each: true })
    @Field(() => [String], { nullable: true })
    subject: string[] | null;

    /**
     * The set of fields for this UserPermission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(100, { each: true })
    @Field(() => [String], { nullable: true })
    fields: string[] | null;

    /**
     * Any conditional checks for this UserPermission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @IsObject()
    @Field(() => GraphQLJSON, { nullable: true })
    conditions: Prisma.JsonValue | null;

    /**
     * True if this UserPermission is a denying permission. False if this UserPermission is an allowing permission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @IsBoolean()
    @Field(() => Boolean, { nullable: true })
    inverted: boolean | null;

    /**
     * The reason for this UserPermission if this UserPermission has {@link #inverted} equal to true.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(300)
    @Field(() => String, { nullable: true })
    reason: string | null;
}
