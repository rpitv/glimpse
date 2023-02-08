import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AssetOrderableFields {
    id = "id",
    tag = "tag",
    name = "name",
    lastKnownLocation = "lastKnownLocation",
    isLost = "isLost",
    purchasePrice = "purchasePrice",
    purchaseDate = "purchaseDate",
    parentId = "parentId"
}

registerEnumType(AssetOrderableFields, {
    name: "AssetOrderableFields"
});

/**
 * Input type for ordering Assets in ReadMany queries.
 */
@InputType()
export class OrderAssetInput {
    /**
     * Name of the field to sort by.
     */
    field: AssetOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
