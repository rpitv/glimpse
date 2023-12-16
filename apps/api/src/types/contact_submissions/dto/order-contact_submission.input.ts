import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum ContactSubmissionOrderableFields {
    id = "id",
    timestamp = "timestamp"
}

registerEnumType(ContactSubmissionOrderableFields, {
    name: "ContactSubmissionOrderableFields"
});

/**
 * Input type for ordering ContactSubmissions in ReadMany queries.
 */
@InputType()
export class OrderContactSubmissionInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => ContactSubmissionOrderableFields)
    field: ContactSubmissionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
