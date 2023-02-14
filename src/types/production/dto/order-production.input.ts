import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum ProductionOrderableFields {
    id = "id",
    name = "name",
    startTime = "startTime",
    categoryId = "categoryId",
}

registerEnumType(ProductionOrderableFields, {
    name: "ProductionOrderableFields"
});

/**
 * Input type for ordering Productions in ReadMany queries.
 */
@InputType()
export class OrderProductionInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
