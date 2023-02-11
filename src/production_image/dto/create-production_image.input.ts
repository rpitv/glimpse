import { InputType, OmitType } from "@nestjs/graphql";
import { ProductionImage } from "../production_image.entity";

/**
 * Input type for createProductionImage mutation
 */
@InputType()
export class CreateProductionImageInput extends OmitType(ProductionImage, ["id"], InputType) {}
