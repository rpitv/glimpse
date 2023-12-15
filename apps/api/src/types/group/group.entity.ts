import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsInt, MaxLength } from "class-validator";
import { Group as PrismaGroup } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class Group implements PrismaGroup {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Group" is passed to CASL's
     *   can() method, and the passed Group object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Group" as const;

    /**
     * Unique ID for this Group. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The display name for this Group
     */
    @MaxLength(50)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The priority of this Group. Groups with a higher priority will override the permissions of Groups with a lower
     *  priority.
     */
    @IsInt()
    @Field(() => Int, { nullable: true })
    priority: number | null;

    /**
     * The ID of the parent of this Group. If null, this Group is a top-level Group.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    parentId: bigint | null;
}
