import { CreateRedirectInput } from "./create-redirect.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateRedirect mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateRedirectInput extends PartialType(CreateRedirectInput) {}
