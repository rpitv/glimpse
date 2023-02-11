import { InputType, OmitType } from "@nestjs/graphql";
import { ProductionRSVP } from "../production_rsvp.entity";

/**
 * Input type for createProductionRSVP mutation
 */
@InputType()
export class CreateProductionRSVPInput extends OmitType(ProductionRSVP, ["id"], InputType) {}
