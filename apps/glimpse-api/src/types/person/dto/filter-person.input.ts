import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Persons in ReadMany queries.
 */
@InputType()
export class FilterPersonInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    name?: StringComparisonInput;
    /**
     * Filter by graduation
     */
    graduation?: DateComparisonInput;

    AND?: FilterPersonInput[];
    OR?: FilterPersonInput[];
    NOT?: FilterPersonInput;
}
