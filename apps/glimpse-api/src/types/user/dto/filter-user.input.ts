import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Users in ReadMany queries.
 */
@InputType()
export class FilterUserInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by email address
     */
    mail?: StringComparisonInput;
    /**
     * Filter by username
     */
    username?: StringComparisonInput;
    /**
     * Filter by Person ID
     */
    personId?: NumberComparisonInput;
    /**
     * Filter by joined date
     */
    joined?: DateComparisonInput;
    /**
     * Filter by Discord ID
     */
    discord?: StringComparisonInput;

    AND?: FilterUserInput[];
    OR?: FilterUserInput[];
    NOT?: FilterUserInput;
}
