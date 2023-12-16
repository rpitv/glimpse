import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => AuditLogOrderableFields)
    field: AuditLogOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
