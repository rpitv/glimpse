import { CreateImageInput } from "./create-image.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateImageInput extends PartialType(CreateImageInput) {}
