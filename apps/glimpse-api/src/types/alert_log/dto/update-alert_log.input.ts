import { CreateAlertLogInput } from "./create-alert_log.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateAlertLog mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateAlertLogInput extends PartialType(CreateAlertLogInput) {}
