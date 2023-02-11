import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum ProductionRSVPOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title"
}

registerEnumType(ProductionRSVPOrderableFields, {
    name: "ProductionRSVPOrderableFields"
});

/**
 * Input type for ordering ProductionRSVPs in ReadMany queries.
 */
@InputType()
export class OrderProductionRSVPInput {
    /**
     * Name of the field to sort by.
     */
    field: ProductionRSVPOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
