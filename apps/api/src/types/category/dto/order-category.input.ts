import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => CategoryOrderableFields)
    field: CategoryOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
