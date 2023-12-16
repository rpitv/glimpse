import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum PersonRoleOrderableFields {
    id = "id",
    startTime = "startTime"
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
    @Field(() => PersonRoleOrderableFields)
    field: PersonRoleOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
