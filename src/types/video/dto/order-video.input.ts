import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum VideoOrderableFields {
    id = "id",
    name = "name"
}

registerEnumType(VideoOrderableFields, {
    name: "VideoOrderableFields"
});

/**
 * Input type for ordering Videos in ReadMany queries.
 */
@InputType()
export class OrderVideoInput {
    /**
     * Name of the field to sort by.
     */
    field: VideoOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
