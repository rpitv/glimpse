import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum CreditOrderableFields {
    id = "id",
    priority = "priority",
    title = "title"
}

registerEnumType(CreditOrderableFields, {
    name: "CreditOrderableFields"
});

/**
 * Input type for ordering Credits in ReadMany queries.
 */
@InputType()
export class OrderCreditInput {
    /**
     * Name of the field to sort by.
     */
    field: CreditOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
