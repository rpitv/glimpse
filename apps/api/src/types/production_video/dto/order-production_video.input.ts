import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => ProductionVideoOrderableFields)
    field: ProductionVideoOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
