import { Field, HideField, ObjectType } from "@nestjs/graphql";
import {
    IsAlphanumeric,
    IsDate,
    IsEmail,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    MinLength
} from "class-validator";
import { User as PrismaUser } from "@prisma/client";
import { GraphQLBigInt } from "graphql-scalars";
import { BigIntMin } from "../../custom-validators";

@ObjectType()
export class User implements PrismaUser {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "User" is passed to CASL's
     *   can() method, and the passed User object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "User" as const;

    /**
     * Unique ID for this User. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * Unique username for this user. Must be less than or equal to 8 characters in length and must be alphanumeric.
     * Recommended to be the user's RCS ID.
     */
    @Length(1, 8)
    @IsAlphanumeric()
    @Field(() => String, { nullable: true })
    username: string | null;

    /**
     * Email address for this user.
     */
    @IsEmail()
    @Field(() => String, { nullable: true })
    mail: string | null;

    /**
     * Attached Person's ID, or null if this user does not have a linked Person.
     */
    @IsOptional()
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    personId: bigint | null;

    /**
     * Discord account ID for this user, or null if the user does not have a linked Discord account.
     */
    @IsNumberString()
    @Length(18, 32)
    @IsOptional()
    @Field(() => String, { nullable: true })
    discord: string | null;

    /**
     * DateTime at which the user's account was created.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    joined: Date | null;

    /**
     * The user's password hash
     */
    @HideField()
    @IsString()
    @MinLength(8)
    @IsOptional()
    password: string | null;
}
