import {Field, InputType} from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering ProductionVideos in ReadMany queries.
 */
@InputType()
export class FilterProductionVideoInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    productionId?: NumberComparisonInput;
    /**
     * Filter by Video ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    videoId?: NumberComparisonInput;

    @Field(() => [FilterProductionVideoInput], { nullable: true })
    AND?: FilterProductionVideoInput[];
    @Field(() => [FilterProductionVideoInput], { nullable: true })
    OR?: FilterProductionVideoInput[];
    @Field(() => FilterProductionVideoInput, { nullable: true })
    NOT?: FilterProductionVideoInput;
}
