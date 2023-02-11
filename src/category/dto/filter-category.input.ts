import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering Categories in ReadMany queries.
 */
@InputType()
export class FilterCategoryInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    name?: StringComparisonInput;
    /**
     * Filter by priority
     */
    priority?: NumberComparisonInput;
    /**
     * Filter by parent category ID
     */
    parentId?: NumberComparisonInput;

    AND?: FilterCategoryInput[];
    OR?: FilterCategoryInput[];
    NOT?: FilterCategoryInput;
}
