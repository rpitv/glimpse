import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AccessLogOrderableFields {
    id = "id",
    timestamp = "timestamp",
    service = "service"
}

registerEnumType(AccessLogOrderableFields, {
    name: "AccessLogOrderableFields"
});

/**
 * Input type for ordering AccessLogs in ReadMany queries.
 */
@InputType()
export class OrderAccessLogInput {
    /**
     * Name of the field to sort by.
     */
    field: AccessLogOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
