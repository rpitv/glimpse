import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AuditLogOrderableFields {
    id = "id",
    timestamp = "timestamp",
    subject = "subject",
    message = "message",
    identifier = "identifier"
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
