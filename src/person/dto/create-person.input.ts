import { InputType, OmitType } from "@nestjs/graphql";
import { Person } from "../person.entity";

/**
 * Input type for createPerson mutation
 */
@InputType()
export class CreatePersonInput extends OmitType(Person, ["id"], InputType) {}
