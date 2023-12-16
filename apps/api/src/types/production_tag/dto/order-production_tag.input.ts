import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum ProductionTagOrderableFields {
    id = "id",
    tag = "tag"
}

registerEnumType(ProductionTagOrderableFields, {
    name: "ProductionTagOrderableFields"
});

/**
 * Input type for ordering ProductionTags in ReadMany queries.
 */
@InputType()
export class OrderProductionTagInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => ProductionTagOrderableFields)
    field: ProductionTagOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
