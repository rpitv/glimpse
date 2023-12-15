import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering AlertLogs in ReadMany queries.
 */
@InputType()
export class FilterAlertLogInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by message
     */
    message?: StringComparisonInput;
    /**
     * Filter by severity
     */
    severity?: StringComparisonInput;
    /**
     * Filter by timestamp
     */
    timestamp?: DateComparisonInput;

    AND?: FilterAlertLogInput[];
    OR?: FilterAlertLogInput[];
    NOT?: FilterAlertLogInput;
}
