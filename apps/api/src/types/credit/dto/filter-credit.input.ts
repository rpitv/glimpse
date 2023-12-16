import {Field, InputType} from "@nestjs/graphql";
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
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by position title
     */
    @Field(() => StringComparisonInput, { nullable: true })
    title?: StringComparisonInput;
    /**
     * Filter by ID of the Person the Credit is for
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    personId?: NumberComparisonInput;
    /**
     * Filter by ID of the Production the Credit is for
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    productionId?: NumberComparisonInput;

    @Field(() => [FilterCreditInput], { nullable: true })
    AND?: FilterCreditInput[];
    @Field(() => [FilterCreditInput], { nullable: true })
    OR?: FilterCreditInput[];
    @Field(() => FilterCreditInput, { nullable: true })
    NOT?: FilterCreditInput;
}
