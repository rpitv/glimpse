import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

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
     * Filter by Redirect key, used in URLs.
     */
    key?: StringComparisonInput;
    /**
     * Filter by Redirect location. User is redirected to this URL.
     */
    location?: StringComparisonInput;
    /**
     * Filter by when the Redirect expires.
     */
    expires?: DateComparisonInput;

    AND?: FilterRedirectInput[];
    OR?: FilterRedirectInput[];
    NOT?: FilterRedirectInput;
}
