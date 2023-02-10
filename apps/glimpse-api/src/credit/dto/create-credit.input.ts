import { InputType, OmitType } from "@nestjs/graphql";
import { Credit } from "../credit.entity";

/**
 * Input type for createCredit mutation
 */
@InputType()
export class CreateCreditInput extends OmitType(Credit, ["id"], InputType) {}
