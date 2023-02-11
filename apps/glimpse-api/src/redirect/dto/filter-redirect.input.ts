import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering Redirects in ReadMany queries.
 */
@InputType()
export class FilterRedirectInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Redirect.
     */
    name?: StringComparisonInput;
    /**
     * Filter by the path of this Redirect.
     */
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Redirect.
     */
    description?: StringComparisonInput;

    AND?: FilterRedirectInput[];
    OR?: FilterRedirectInput[];
    NOT?: FilterRedirectInput;
}
