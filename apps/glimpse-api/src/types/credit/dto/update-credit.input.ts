import { CreateCreditInput } from "./create-credit.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateCredit mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateCreditInput extends PartialType(CreateCreditInput) {}
