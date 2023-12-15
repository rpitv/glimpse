import { Field, InputType, OmitType } from "@nestjs/graphql";
import { User } from "../user.entity";
import { IsOptional, IsString, MinLength } from "class-validator";

/**
 * Input type for createUser mutation
 */
@InputType()
export class CreateUserInput extends OmitType(User, ["id", "joined"], InputType) {
    /**
     * The password to set for this user
     */
    @Field(() => String, { nullable: true })
    @IsString()
    @MinLength(8)
    @IsOptional()
    password: string | null;
}
