import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum ProductionVideoOrderableFields {
    priority = "priority"
}

registerEnumType(ProductionVideoOrderableFields, {
    name: "ProductionVideoOrderableFields"
});

/**
 * Input type for ordering Categories in ReadMany queries.
 */
@InputType()
export class OrderProductionVideoInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionVideoOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
