import { InputType, OmitType } from "@nestjs/graphql";
import { UserGroup } from "../user_group.entity";

/**
 * Input type for createUserGroup mutation
 */
@InputType()
export class CreateUserGroupInput extends OmitType(UserGroup, ["id"], InputType) {}
