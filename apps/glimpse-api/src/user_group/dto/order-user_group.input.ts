import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum UserGroupOrderableFields {
    id = "id",
}

registerEnumType(UserGroupOrderableFields, {
    name: "UserGroupOrderableFields"
});

/**
 * Input type for ordering UserGroups in ReadMany queries.
 */
@InputType()
export class OrderUserGroupInput {
    /**
     * Name of the field to sort by.
     */
    field: UserGroupOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
