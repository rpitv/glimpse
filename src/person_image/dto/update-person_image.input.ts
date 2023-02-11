import { CreatePersonImageInput } from "./create-person_image.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updatePersonImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdatePersonImageInput extends PartialType(CreatePersonImageInput) {}
