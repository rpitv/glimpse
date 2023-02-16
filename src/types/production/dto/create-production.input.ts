import { InputType, OmitType } from "@nestjs/graphql";
import { Production } from "../production.entity";

/**
 * Input type for createProduction mutation
 */
@InputType()
export class CreateProductionInput extends OmitType(Production, ["id"], InputType) {}
