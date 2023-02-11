import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering Votes in ReadMany queries.
 */
@InputType()
export class FilterVoteInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by question
     */
    question?: StringComparisonInput;
    /**
     * Filter by expiry datetime
     */
    expires?: DateComparisonInput;
    /**
     * Filter by description
     */
    description?: StringComparisonInput;

    AND?: FilterVoteInput[];
    OR?: FilterVoteInput[];
    NOT?: FilterVoteInput;
}
