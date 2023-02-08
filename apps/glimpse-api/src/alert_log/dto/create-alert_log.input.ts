import { InputType, OmitType } from "@nestjs/graphql";
import { AlertLog } from "../alert_log.entity";

/**
 * Input type for createAlertLog mutation
 */
@InputType()
export class CreateAlertLogInput extends OmitType(AlertLog, ["id", "timestamp"], InputType) {}
