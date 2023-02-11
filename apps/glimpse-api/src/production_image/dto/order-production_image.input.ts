import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ProductionImageOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(ProductionImageOrderableFields, {
    name: "ProductionImageOrderableFields"
});

/**
 * Input type for ordering ProductionImages in ReadMany queries.
 */
@InputType()
export class OrderProductionImageInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionImageOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
