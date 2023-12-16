import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum PersonOrderableFields {
    id = "id",
    name = "name",
    graduation = "graduation"
}

registerEnumType(PersonOrderableFields, {
    name: "PersonOrderableFields"
});

/**
 * Input type for ordering Persons in ReadMany queries.
 */
@InputType()
export class OrderPersonInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => PersonOrderableFields)
    field: PersonOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
