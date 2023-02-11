import { CreateProductionVideoInput } from "./create-production_video.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateProductionVideo mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateProductionVideoInput extends PartialType(CreateProductionVideoInput) {}
