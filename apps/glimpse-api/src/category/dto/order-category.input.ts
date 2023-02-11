import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum CategoryOrderableFields {
    id = "id",
    priority = "priority",
    name = "name"
}

registerEnumType(CategoryOrderableFields, {
    name: "CategoryOrderableFields"
});

/**
 * Input type for ordering Categories in ReadMany queries.
 */
@InputType()
export class OrderCategoryInput {
    /**
     * Name of the field to sort by.
     */
    field: CategoryOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
