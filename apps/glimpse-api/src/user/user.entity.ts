import { ObjectType, Field, ID, HideField } from "@nestjs/graphql";
import {
    IsAlphanumeric,
    IsDate,
    IsEmail,
    IsInt,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    Min,
    MinLength
} from "class-validator";
import { User as PrismaUser } from "@prisma/client";

@ObjectType()
export class User implements PrismaUser {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "User" is passed to CASL's
     *   can() method, and the passed User object hasn't passed through the subject() helper function.
     * @see https://casl.js.org/v5/en/advanced/typescript
     */
    static readonly modelName = "User" as const;

    /**
     * Unique ID for this User. Automatically generated.
     */
    @Field(() => ID)
    @IsInt()
    @Min(0)
    id: number;

    /**
     * Unique username for this user. Must be less than or equal to 8 characters in length and must be alphanumeric.
     * Recommended to be the user's RCS ID.
     */
    @Length(1, 8)
    @IsAlphanumeric()
    username: string;

    /**
     * Email address for this user.
     */
    @IsEmail()
    mail: string;

    /**
     * Attached Person's ID, or null if this user does not have a linked Person.
     */
    @IsOptional()
    @IsInt()
    @Min(0)
    personId: number | null;

    /**
     * Discord account ID for this user, or null if the user does not have a linked Discord account.
     */
    @IsNumberString()
    @Length(18, 18)
    @IsOptional()
    discord: string | null;

    /**
     * DateTime at which the user's account was created.
     */
    @IsDate()
    joined: Date;

    /**
     * The user's password hash
     */
    @HideField()
    @IsString()
    @MinLength(8)
    @IsOptional()
    password: string | null;
}
