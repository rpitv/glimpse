import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ProductionTagOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(ProductionTagOrderableFields, {
    name: "ProductionTagOrderableFields"
});

/**
 * Input type for ordering ProductionTags in ReadMany queries.
 */
@InputType()
export class OrderProductionTagInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionTagOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
