import { CreateUserInput } from "./create-user.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateUser mutation. Null values are not updated. To update a non-null value to null, explicitly pass null.
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
