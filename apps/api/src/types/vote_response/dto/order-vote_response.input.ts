import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum VoteResponseOrderableFields {
    id = "id",
    timestamp = "timestamp"
}

registerEnumType(VoteResponseOrderableFields, {
    name: "VoteResponseOrderableFields"
});

/**
 * Input type for ordering VoteResponses in ReadMany queries.
 */
@InputType()
export class OrderVoteResponseInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => VoteResponseOrderableFields)
    field: VoteResponseOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
