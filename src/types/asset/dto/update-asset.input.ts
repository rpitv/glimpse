import { CreateAssetInput } from "./create-asset.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateAsset mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateAssetInput extends PartialType(CreateAssetInput) {}
