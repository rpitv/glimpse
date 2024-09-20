import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum PersonImageOrderableFields {
    id = "id",
    priority = "priority",
}

registerEnumType(PersonImageOrderableFields, {
    name: "PersonImageOrderableFields"
});

/**
 * Input type for ordering PersonRoles in ReadMany queries.
 */
@InputType()
export class OrderPersonImageInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => PersonImageOrderableFields)
    field: PersonImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
