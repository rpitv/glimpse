import { CreateRoleInput } from "./create-role.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateRole mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {}
