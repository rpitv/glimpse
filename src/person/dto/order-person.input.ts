import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

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
    field: PersonOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
