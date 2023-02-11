import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum RoleOrderableFields {
    id = "id",
    name = "name"
}

registerEnumType(RoleOrderableFields, {
    name: "RoleOrderableFields"
});

/**
 * Input type for ordering Roles in ReadMany queries.
 */
@InputType()
export class OrderRoleInput {
    /**
     * Name of the field to sort by.
     */
    field: RoleOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
