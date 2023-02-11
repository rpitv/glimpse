import { InputType } from "@nestjs/graphql";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering ProductionImages in ReadMany queries.
 */
@InputType()
export class FilterProductionImageInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    productionId?: NumberComparisonInput;
    /**
     * Filter by Image ID
     */
    imageId?: NumberComparisonInput;

    AND?: FilterProductionImageInput[];
    OR?: FilterProductionImageInput[];
    NOT?: FilterProductionImageInput;
}
