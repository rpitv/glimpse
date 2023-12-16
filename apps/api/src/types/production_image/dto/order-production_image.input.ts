import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => ProductionImageOrderableFields)
    field: ProductionImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
