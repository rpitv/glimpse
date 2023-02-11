import { InputType, OmitType } from "@nestjs/graphql";
import { ProductionVideo } from "../production_video.entity";

/**
 * Input type for createProductionVideo mutation
 */
@InputType()
export class CreateProductionVideoInput extends OmitType(ProductionVideo, ["id"], InputType) {}
