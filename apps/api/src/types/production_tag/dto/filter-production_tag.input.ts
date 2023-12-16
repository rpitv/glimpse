import {Field, InputType} from "@nestjs/graphql";
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
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by Production ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    productionId?: NumberComparisonInput;
    /**
     * Filter by tag
     */
    @Field(() => StringComparisonInput, { nullable: true })
    tag?: StringComparisonInput;

    @Field(() => [FilterProductionTagInput], { nullable: true })
    AND?: FilterProductionTagInput[];
    @Field(() => [FilterProductionTagInput], { nullable: true })
    OR?: FilterProductionTagInput[];
    @Field(() => FilterProductionTagInput, { nullable: true })
    NOT?: FilterProductionTagInput;
}
