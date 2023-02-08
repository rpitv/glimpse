import {InputType, OmitType} from "@nestjs/graphql";
import {AuditLog} from "../audit_log.entity";

/**
 * Input type for updateAuditLog mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateAuditLogInput extends OmitType(AuditLog, [
    "id", "userId", "timestamp", "modificationType", "modifiedTable", "modifiedField", "previousValue"
], InputType) {}
