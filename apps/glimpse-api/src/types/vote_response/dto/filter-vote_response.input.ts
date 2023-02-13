import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering VoteResponses in ReadMany queries.
 */
@InputType()
export class FilterVoteResponseInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by user ID
     */
    userId?: NumberComparisonInput;
    /**
     * Filter by vote ID
     */
    voteId?: NumberComparisonInput;
    /**
     * Filter by when they voted
     */
    timestamp?: DateComparisonInput;
    /**
     * Filter by their selection
     */
    selection?: StringComparisonInput;

    AND?: FilterVoteResponseInput[];
    OR?: FilterVoteResponseInput[];
    NOT?: FilterVoteResponseInput;
}
