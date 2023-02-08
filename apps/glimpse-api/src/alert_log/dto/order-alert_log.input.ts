import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AlertLogOrderableFields {
    id = "id",
    message = "message",
    severity = "severity",
    timestamp = "timestamp"
}

registerEnumType(AlertLogOrderableFields, {
    name: "AlertLogOrderableFields"
});

/**
 * Input type for ordering AlertLogs in ReadMany queries.
 */
@InputType()
export class OrderAlertLogInput {
    /**
     * Name of the field to sort by.
     */
    field: AlertLogOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
