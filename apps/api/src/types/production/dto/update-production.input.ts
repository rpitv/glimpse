import { CreateProductionInput } from "./create-production.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateProduction mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateProductionInput extends PartialType(CreateProductionInput) {}
