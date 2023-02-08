import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering AuditLogs in ReadMany queries.
 */
@InputType()
export class FilterAuditLogInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by the user who made the change
     */
    userId?: NumberComparisonInput;
    /**
     * Filter by the time the change was made
     */
    timestamp?: DateComparisonInput;
    /**
     * Filter by the type of change made
     */
    modificationType?: StringComparisonInput;
    /**
     * Filter by the table that was changed
     */
    modifiedTable?: StringComparisonInput;
    /**
     * Filter by the field that was changed
     */
    modifiedField?: StringComparisonInput;
    /**
     * Filter by the value of the field before the change was made
     */
    previousValue?: StringComparisonInput;
    /**
     * Filter by the comment on the change
     */
    comment?: StringComparisonInput;

    AND?: FilterAuditLogInput[];
    OR?: FilterAuditLogInput[];
    NOT?: FilterAuditLogInput;
}
