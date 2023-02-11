import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

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
     * Filter by the name of this Vote.
     */
    name?: StringComparisonInput;
    /**
     * Filter by the path of this Vote.
     */
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Vote.
     */
    description?: StringComparisonInput;

    AND?: FilterVoteInput[];
    OR?: FilterVoteInput[];
    NOT?: FilterVoteInput;
}
