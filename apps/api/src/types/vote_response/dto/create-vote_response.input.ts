import { InputType, OmitType } from "@nestjs/graphql";
import { VoteResponse } from "../vote_response.entity";

/**
 * Input type for createVoteResponse mutation
 */
@InputType()
export class CreateVoteResponseInput extends OmitType(VoteResponse, ["id"], InputType) {}
