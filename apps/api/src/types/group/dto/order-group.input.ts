import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => GroupOrderableFields)
    field: GroupOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
