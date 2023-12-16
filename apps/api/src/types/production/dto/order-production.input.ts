import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum ProductionOrderableFields {
    id = "id",
    name = "name",
    startTime = "startTime",
    categoryId = "categoryId"
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
    @Field(() => ProductionOrderableFields)
    field: ProductionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
