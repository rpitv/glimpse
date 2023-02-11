import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum VoteResponseOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
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
    field: VoteResponseOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
