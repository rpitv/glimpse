import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { IsInt, Min } from "class-validator";
import { UserGroup as PrismaUserGroup } from "@prisma/client";

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
    @IsInt()
    @Min(0)
    @Field(() => ID, { nullable: true })
    id: number | null;

    /**
     * ID of the user this UserGroup is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    userId: number | null;

    /**
     * ID of the group this UserGroup is associated with.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    groupId: number | null;
}
