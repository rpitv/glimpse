import { InputType, OmitType } from "@nestjs/graphql";
import { UserPermission } from "../user_permission.entity";

/**
 * Input type for createUserPermission mutation
 */
@InputType()
export class CreateUserPermissionInput extends OmitType(UserPermission, ["id"], InputType) {}
