import { InputType, OmitType } from "@nestjs/graphql";
import { Asset } from "../asset.entity";

/**
 * Input type for createAsset mutation
 */
@InputType()
export class CreateAssetInput extends OmitType(Asset, ["id"], InputType) {}
