import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AuditLogOrderableFields {
    id = "id",
    userId = "userId",
    timestamp = "timestamp",
    modifiedTable = "modifiedTable",
    modifiedField = "modifiedField",
    previousValue = "previousValue",
    comment = "comment"
}

registerEnumType(AuditLogOrderableFields, {
    name: "AuditLogOrderableFields"
});

/**
 * Input type for ordering AuditLogs in ReadMany queries.
 */
@InputType()
export class OrderAuditLogInput {
    /**
     * Name of the field to sort by.
     */
    field: AuditLogOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
