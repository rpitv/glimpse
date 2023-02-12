import { CreatePersonRoleInput } from "./create-person_role.input";
import {InputType, OmitType, PartialType} from "@nestjs/graphql";

/**
 * Input type for updatePersonRole mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdatePersonRoleInput extends OmitType(PartialType(CreatePersonRoleInput), ["personId", "roleId"]) {}
