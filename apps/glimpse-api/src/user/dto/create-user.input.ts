import {InputType, OmitType} from '@nestjs/graphql';
import {User} from "../user.entity";
import {IsOptional, IsString, MinLength} from "class-validator";

/**
 * Input type for createUser mutation
 */
@InputType()
export class CreateUserInput extends OmitType(User, ['id', 'joined', /* TODO 'person'*/], InputType) {
  /**
   * New password to set for the user. Password cannot be read back once changed. Passwords must be at least 8
   * characters in length.
   */
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;
}
