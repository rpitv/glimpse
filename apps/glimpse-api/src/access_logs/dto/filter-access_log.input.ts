import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering AccessLogs in ReadMany queries.
 */
@InputType()
export class FilterAccessLogInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by service name
     */
    service?: StringComparisonInput;
    /**
     * Filter by User ID
     */
    userId?: NumberComparisonInput;
    /**
     * Filter by timestamp
     */
    timestamp?: DateComparisonInput;
    /**
     * Filter by IP address
     */
    ip?: StringComparisonInput;

    AND?: FilterAccessLogInput[];
    OR?: FilterAccessLogInput[];
    NOT?: FilterAccessLogInput;
}
