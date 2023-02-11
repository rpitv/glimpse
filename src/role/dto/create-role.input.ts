import { InputType, OmitType } from "@nestjs/graphql";
import { Role } from "../role.entity";

/**
 * Input type for createRole mutation
 */
@InputType()
export class CreateRoleInput extends OmitType(Role, ["id"], InputType) {}
