import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ContactSubmissionOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(ContactSubmissionOrderableFields, {
    name: "ContactSubmissionOrderableFields"
});

/**
 * Input type for ordering ContactSubmissionies in ReadMany queries.
 */
@InputType()
export class OrderContactSubmissionInput {
    /**
     * Name of the field to sort by.
     */
    field: ContactSubmissionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
