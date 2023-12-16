import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum RedirectOrderableFields {
    id = "id",
    key = "key",
    expires = "expires"
}

registerEnumType(RedirectOrderableFields, {
    name: "RedirectOrderableFields"
});

/**
 * Input type for ordering Redirects in ReadMany queries.
 */
@InputType()
export class OrderRedirectInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => RedirectOrderableFields)
    field: RedirectOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
