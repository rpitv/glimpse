import { CreateGroupPermissionInput } from "./create-group_permission.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateGroupPermission mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateGroupPermissionInput extends PartialType(CreateGroupPermissionInput) {}
