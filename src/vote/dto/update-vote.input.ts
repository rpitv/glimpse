import { CreateVoteInput } from "./create-vote.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateVote mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateVoteInput extends PartialType(CreateVoteInput) {}
