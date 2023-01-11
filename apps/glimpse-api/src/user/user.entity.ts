import {ObjectType, Field, ID} from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsInt,
  IsNumberString,
  IsOptional,
  Length,
  Min
} from "class-validator";

@ObjectType()
export class User {
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
  personId?: number
  /**
   * Discord account ID for this user, or null if the user does not have a linked Discord account.
   */
  @IsNumberString()
  @Length(18, 18)
  @IsOptional()
  discord?: string;
  /**
   * DateTime at which the user's account was created.
   */
  @IsDate()
  joined: Date;
}
