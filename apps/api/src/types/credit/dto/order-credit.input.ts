import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum CreditOrderableFields {
    id = "id",
    priority = "priority",
    title = "title"
}

registerEnumType(CreditOrderableFields, {
    name: "CreditOrderableFields"
});

/**
 * Input type for ordering Credits in ReadMany queries.
 */
@InputType()
export class OrderCreditInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => CreditOrderableFields)
    field: CreditOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
