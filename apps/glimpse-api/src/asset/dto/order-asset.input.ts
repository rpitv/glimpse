import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum AssetOrderableFields {
    id = "id",
    tag = "tag",
    name = "name",
    purchasePrice = "purchasePrice",
    purchaseDate = "purchaseDate"
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
