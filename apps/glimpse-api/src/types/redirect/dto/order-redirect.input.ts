import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

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
    field: RedirectOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
