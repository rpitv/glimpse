import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ImageOrderableFields {
    id = "id",
    name = "name",
}

registerEnumType(ImageOrderableFields, {
    name: "ImageOrderableFields"
});

/**
 * Input type for ordering Images in ReadMany queries.
 */
@InputType()
export class OrderImageInput {
    /**
     * Name of the field to sort by.
     */
    field: ImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
