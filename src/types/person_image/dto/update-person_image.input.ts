import { CreatePersonImageInput } from "./create-person_image.input";
import { InputType, OmitType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updatePersonImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdatePersonImageInput extends OmitType(PartialType(CreatePersonImageInput), ["imageId", "personId"]) {}
