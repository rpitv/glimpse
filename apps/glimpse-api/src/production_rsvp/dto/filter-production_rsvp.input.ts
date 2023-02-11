import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering ProductionRSVPs in ReadMany queries.
 */
@InputType()
export class FilterProductionRSVPInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    productionId?: NumberComparisonInput;
    /**
     * Filter by User ID
     */
    userId?: NumberComparisonInput;
    /**
     * Filter by whether the User will attend the Production
     */
    willAttend?: StringComparisonInput;
    /**
     * Filter by any additional notes provided by the User, officers, or producers
     */
    notes?: StringComparisonInput;

    AND?: FilterProductionRSVPInput[];
    OR?: FilterProductionRSVPInput[];
    NOT?: FilterProductionRSVPInput;
}
