import { InputType, OmitType } from "@nestjs/graphql";
import { User } from "../user.entity";

/**
 * Input type for createUser mutation
 */
@InputType()
export class CreateUserInput extends OmitType(User, ["id", "joined" /* TODO 'person'*/], InputType) {}
