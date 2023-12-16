import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

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
    @Field(() => VideoOrderableFields)
    field: VideoOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
