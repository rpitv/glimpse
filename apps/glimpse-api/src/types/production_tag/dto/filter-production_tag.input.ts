import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering ProductionTags in ReadMany queries.
 */
@InputType()
export class FilterProductionTagInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    productionId?: NumberComparisonInput;
    /**
     * Filter by tag
     */
    tag?: StringComparisonInput;

    AND?: FilterProductionTagInput[];
    OR?: FilterProductionTagInput[];
    NOT?: FilterProductionTagInput;
}
