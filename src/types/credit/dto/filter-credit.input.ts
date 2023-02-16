import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Credits in ReadMany queries.
 */
@InputType()
export class FilterCreditInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by position title
     */
    title?: StringComparisonInput;
    /**
     * Filter by ID of the Person the Credit is for
     */
    personId?: NumberComparisonInput;
    /**
     * Filter by ID of the Production the Credit is for
     */
    productionId?: NumberComparisonInput;

    AND?: FilterCreditInput[];
    OR?: FilterCreditInput[];
    NOT?: FilterCreditInput;
}
