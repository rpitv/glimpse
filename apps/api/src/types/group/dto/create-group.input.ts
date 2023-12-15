import { InputType, OmitType } from "@nestjs/graphql";
import { Group } from "../group.entity";

/**
 * Input type for createGroup mutation
 */
@InputType()
export class CreateGroupInput extends OmitType(Group, ["id"], InputType) {}
