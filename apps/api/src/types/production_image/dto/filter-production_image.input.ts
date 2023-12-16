import {Field, InputType} from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering ProductionImages in ReadMany queries.
 */
@InputType()
export class FilterProductionImageInput {
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
     * Filter by Image ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    imageId?: NumberComparisonInput;

    @Field(() => [FilterProductionImageInput], { nullable: true })
    AND?: FilterProductionImageInput[];
    @Field(() => [FilterProductionImageInput], { nullable: true })
    OR?: FilterProductionImageInput[];
    @Field(() => FilterProductionImageInput, { nullable: true })
    NOT?: FilterProductionImageInput;
}
