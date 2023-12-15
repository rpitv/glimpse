import { InputType, OmitType } from "@nestjs/graphql";
import { Vote } from "../vote.entity";

/**
 * Input type for createVote mutation
 */
@InputType()
export class CreateVoteInput extends OmitType(Vote, ["id"], InputType) {}
