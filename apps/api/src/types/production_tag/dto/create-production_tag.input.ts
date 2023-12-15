import { InputType, OmitType } from "@nestjs/graphql";
import { ProductionTag } from "../production_tag.entity";

/**
 * Input type for createProductionTag mutation
 */
@InputType()
export class CreateProductionTagInput extends OmitType(ProductionTag, ["id"], InputType) {}
