import { CreatePersonInput } from "./create-person.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updatePerson mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdatePersonInput extends PartialType(CreatePersonInput) {}
