import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum VoteOrderableFields {
    id = "id",
    question = "question",
    expires = "expires"
}

registerEnumType(VoteOrderableFields, {
    name: "VoteOrderableFields"
});

/**
 * Input type for ordering Votes in ReadMany queries.
 */
@InputType()
export class OrderVoteInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => VoteOrderableFields)
    field: VoteOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
