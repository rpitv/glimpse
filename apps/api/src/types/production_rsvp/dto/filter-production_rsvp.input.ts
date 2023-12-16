import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering ProductionRSVPs in ReadMany queries.
 */
@InputType()
export class FilterProductionRSVPInput {
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
     * Filter by User ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    userId?: NumberComparisonInput;
    /**
     * Filter by whether the User will attend the Production
     */
    @Field(() => StringComparisonInput, { nullable: true })
    willAttend?: StringComparisonInput;
    /**
     * Filter by any additional notes provided by the User, officers, or producers
     */
    @Field(() => StringComparisonInput, { nullable: true })
    notes?: StringComparisonInput;

    @Field(() => [FilterProductionRSVPInput], { nullable: true })
    AND?: FilterProductionRSVPInput[];
    @Field(() => [FilterProductionRSVPInput], { nullable: true })
    OR?: FilterProductionRSVPInput[];
    @Field(() => FilterProductionRSVPInput, { nullable: true })
    NOT?: FilterProductionRSVPInput;
}
