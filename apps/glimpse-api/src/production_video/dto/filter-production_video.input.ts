import { InputType } from "@nestjs/graphql";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

/**
 * Input type for filtering ProductionVideos in ReadMany queries.
 */
@InputType()
export class FilterProductionVideoInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    productionId?: NumberComparisonInput;
    /**
     * Filter by Video ID
     */
    videoId?: NumberComparisonInput;

    AND?: FilterProductionVideoInput[];
    OR?: FilterProductionVideoInput[];
    NOT?: FilterProductionVideoInput;
}
