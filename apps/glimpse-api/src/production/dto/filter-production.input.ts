import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering Productions in ReadMany queries.
 */
@InputType()
export class FilterProductionInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    name?: StringComparisonInput;
    /**
     * Filter by description
     */
    description?: StringComparisonInput;
    /**
     * Filter by start time
     */
    startTime?: DateComparisonInput;
    /**
     * Filter by end time
     */
    endTime?: DateComparisonInput;
    /**
     * Filter by category ID
     */
    categoryId?: NumberComparisonInput;
    /**
     * Filter by closet location
     */
    closetLocation?: StringComparisonInput;
    /**
     * Filter by closet time
     */
    closetTime?: DateComparisonInput;
    /**
     * Filter by event location
     */
    eventLocation?: StringComparisonInput;
    /**
     * Filter by team notes
     */
    teamNotes?: StringComparisonInput;
    /**
     * Filter by thumbnail Image ID
     */
    thumbnailId?: NumberComparisonInput;

    AND?: FilterProductionInput[];
    OR?: FilterProductionInput[];
    NOT?: FilterProductionInput;
}
