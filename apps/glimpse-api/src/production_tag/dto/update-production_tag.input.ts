import { CreateProductionTagInput } from "./create-production_tag.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateProductionTag mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateProductionTagInput extends PartialType(CreateProductionTagInput) {}
