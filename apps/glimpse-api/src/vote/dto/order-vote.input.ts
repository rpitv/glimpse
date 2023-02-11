import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum VoteOrderableFields {
    id = "id",
    name = "name"
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
    field: VoteOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
