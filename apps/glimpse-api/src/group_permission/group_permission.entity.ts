import { ObjectType, Field, ID } from "@nestjs/graphql";
import {IsBoolean, IsInt, IsObject, MaxLength, Min} from "class-validator";
import {GroupPermission as PrismaGroupPermission, Prisma} from "@prisma/client";
import JSON from "graphql-type-json";

@ObjectType()
export class GroupPermission implements PrismaGroupPermission {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "GroupPermission" is passed to CASL's
     *   can() method, and the passed GroupPermission object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "GroupPermission" as const;

    /**
     * Unique ID for this blog post. Automatically generated.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the group which this GroupPermission is for.
     */
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    groupId: number | null;

    /**
     * The action for this GroupPermission. Should be a valid action within {@link AbilityAction}.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    action: string | null;

    /**
     * The set of subjects for this GroupPermission. Should be all valid subjects within {@link AbilitySubjects}.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(300, { each: true })
    @Field(() => [String], { nullable: true })
    subject: string[] | null;

    /**
     * The set of fields for this GroupPermission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(100, { each: true })
    @Field(() => [String], { nullable: true })
    fields: string[] | null;

    /**
     * Any conditional checks for this GroupPermission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @IsObject()
    @Field(() => JSON, { nullable: true })
    conditions: Prisma.JsonValue | null;

    /**
     * True if this GroupPermission is a denying permission. False if this GroupPermission is an allowing permission.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @IsBoolean()
    @Field(() => Boolean, { nullable: true })
    inverted: boolean | null;

    /**
     * The reason for this GroupPermission if this GroupPermission has {@link #inverted} equal to true.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     */
    @MaxLength(300)
    @Field(() => String, { nullable: true })
    reason: string | null;

}
