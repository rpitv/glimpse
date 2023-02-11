import { CreateProductionImageInput } from "./create-production_image.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateProductionImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateProductionImageInput extends PartialType(CreateProductionImageInput) {}
