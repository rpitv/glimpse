import { CreateGroupInput } from "./create-group.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateGroup mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {}
