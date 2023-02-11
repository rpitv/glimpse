import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum PersonRoleOrderableFields {
    id = "id",
    startTime = "startTime",
}

registerEnumType(PersonRoleOrderableFields, {
    name: "PersonRoleOrderableFields"
});

/**
 * Input type for ordering PersonRoles in ReadMany queries.
 */
@InputType()
export class OrderPersonRoleInput {
    /**
     * Name of the field to sort by.
     */
    field: PersonRoleOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
