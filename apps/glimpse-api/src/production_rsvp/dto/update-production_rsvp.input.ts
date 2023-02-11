import { CreateProductionRSVPInput } from "./create-production_rsvp.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateProductionRSVP mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateProductionRSVPInput extends PartialType(CreateProductionRSVPInput) {}
