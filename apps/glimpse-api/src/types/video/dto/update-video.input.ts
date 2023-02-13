import { CreateVideoInput } from "./create-video.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateVideo mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateVideoInput extends PartialType(CreateVideoInput) {}
