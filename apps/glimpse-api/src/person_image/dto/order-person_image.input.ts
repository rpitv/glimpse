import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum PersonImageOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(PersonImageOrderableFields, {
    name: "PersonImageOrderableFields"
});

/**
 * Input type for ordering PersonImages in ReadMany queries.
 */
@InputType()
export class OrderPersonImageInput {
    /**
     * Name of the field to sort by.
     */
    field: PersonImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
