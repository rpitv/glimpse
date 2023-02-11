import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum GroupOrderableFields {
    id = "id",
    priority = "priority",
    name = "name"
}

registerEnumType(GroupOrderableFields, {
    name: "GroupOrderableFields"
});

/**
 * Input type for ordering Groups in ReadMany queries.
 */
@InputType()
export class OrderGroupInput {
    /**
     * Name of the field to sort by.
     */
    field: GroupOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
