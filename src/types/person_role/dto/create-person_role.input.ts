import { InputType, OmitType } from "@nestjs/graphql";
import { PersonRole } from "../person_role.entity";

/**
 * Input type for createPersonRole mutation
 */
@InputType()
export class CreatePersonRoleInput extends OmitType(PersonRole, ["id"], InputType) {}
