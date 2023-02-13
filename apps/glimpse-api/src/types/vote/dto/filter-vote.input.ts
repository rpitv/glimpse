import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

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
