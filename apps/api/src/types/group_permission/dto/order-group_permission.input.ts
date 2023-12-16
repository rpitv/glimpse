import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => GroupPermissionOrderableFields)
    field: GroupPermissionOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
