import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";
import {BooleanComparisonInput} from "../../generic/boolean-comparison.input";

/**
 * Input type for filtering ContactSubmissions in ReadMany queries.
 */
@InputType()
export class FilterContactSubmissionInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by the email of the person who submitted the ContactSubmission.
     */
    email?: StringComparisonInput;
    /**
     * Filter by the name of the person who submitted the ContactSubmission.
     */
    name?: StringComparisonInput;
    /**
     * Filter by timestamp
     */
    timestamp?: DateComparisonInput;
    /**
     * Filter by resolved status
     */
    resolved?: BooleanComparisonInput;

    AND?: FilterContactSubmissionInput[];
    OR?: FilterContactSubmissionInput[];
    NOT?: FilterContactSubmissionInput;
}
