import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum RoleOrderableFields {
    id = "id",
    name = "name",
    priority = "priority"
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
    @Field(() => RoleOrderableFields)
    field: RoleOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
