import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Images in ReadMany queries.
 */
@InputType()
export class FilterImageInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Image.
     */
    name?: StringComparisonInput;
    /**
     * Filter by the path of this Image.
     */
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Image.
     */
    description?: StringComparisonInput;

    AND?: FilterImageInput[];
    OR?: FilterImageInput[];
    NOT?: FilterImageInput;
}
