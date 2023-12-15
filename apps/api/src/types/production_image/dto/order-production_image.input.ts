import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum ProductionImageOrderableFields {
    priority = "priority"
}

registerEnumType(ProductionImageOrderableFields, {
    name: "ProductionImageOrderableFields"
});

/**
 * Input type for ordering Categories in ReadMany queries.
 */
@InputType()
export class OrderProductionImageInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
