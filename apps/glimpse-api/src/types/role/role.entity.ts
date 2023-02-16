import {Field, ObjectType} from "@nestjs/graphql";
import {MaxLength} from "class-validator";
import {Role as PrismaRole} from "@prisma/client";
import {GraphQLBigInt} from "graphql-scalars";
import {BigIntMin} from "../../custom-validators";

@ObjectType()
export class Role implements PrismaRole {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Role" is passed to CASL's
     *   can() method, and the passed Role object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Role" as const;

    /**
     * Unique ID for this Role. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * The name of this role.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The optional description of this role. May be what people within this role are responsible for, for example.
     */
    @MaxLength(1000)
    @Field(() => String, { nullable: true })
    description: string | null;
}
