import { CreateVoteResponseInput } from "./create-vote_response.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateVoteResponse mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateVoteResponseInput extends PartialType(CreateVoteResponseInput) {}
