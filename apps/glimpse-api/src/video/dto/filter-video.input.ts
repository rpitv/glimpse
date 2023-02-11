import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering Videos in ReadMany queries.
 */
@InputType()
export class FilterVideoInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Video.
     */
    name?: StringComparisonInput;
    /**
     * Filter by the path of this Video.
     */
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Video.
     */
    description?: StringComparisonInput;

    AND?: FilterVideoInput[];
    OR?: FilterVideoInput[];
    NOT?: FilterVideoInput;
}
