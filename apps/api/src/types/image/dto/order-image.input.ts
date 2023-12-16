import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";

enum ImageOrderableFields {
    id = "id",
    name = "name"
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
    @Field(() => ImageOrderableFields)
    field: ImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
