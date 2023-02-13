import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum GroupPermissionOrderableFields {
    id = "id",
    action = "action"
}

registerEnumType(GroupPermissionOrderableFields, {
    name: "GroupPermissionOrderableFields"
});

/**
 * Input type for ordering GroupPermissions in ReadMany queries.
 */
@InputType()
export class OrderGroupPermissionInput {
    /**
     * Name of the field to sort by.
     */
    field: GroupPermissionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
