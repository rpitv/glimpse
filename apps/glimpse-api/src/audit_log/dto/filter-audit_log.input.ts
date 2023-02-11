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
     * Filter by the changed subject type
     */
    subject?: StringComparisonInput;
    /**
     * Filter by the identifier of the object within the subject type (e.g. the ID of the user)
     */
    identifier?: NumberComparisonInput;

    AND?: FilterAuditLogInput[];
    OR?: FilterAuditLogInput[];
    NOT?: FilterAuditLogInput;
}
