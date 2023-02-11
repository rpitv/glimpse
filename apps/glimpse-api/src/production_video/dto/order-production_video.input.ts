import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ProductionVideoOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(ProductionVideoOrderableFields, {
    name: "ProductionVideoOrderableFields"
});

/**
 * Input type for ordering ProductionVideos in ReadMany queries.
 */
@InputType()
export class OrderProductionVideoInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionVideoOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}