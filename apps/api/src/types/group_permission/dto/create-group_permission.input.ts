import { InputType, OmitType } from "@nestjs/graphql";
import { GroupPermission } from "../group_permission.entity";

/**
 * Input type for createGroupPermission mutation
 */
@InputType()
export class CreateGroupPermissionInput extends OmitType(GroupPermission, ["id"], InputType) {}
