import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering Groups in ReadMany queries.
 */
@InputType()
export class FilterGroupInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    name?: StringComparisonInput;
    /**
     * Filter by parent group ID
     */
    parentId?: NumberComparisonInput;

    AND?: FilterGroupInput[];
    OR?: FilterGroupInput[];
    NOT?: FilterGroupInput;
}
