import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Videos in ReadMany queries.
 */
@InputType()
export class FilterVideoInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by format
     */
    @Field(() => StringComparisonInput, { nullable: true })
    format?: StringComparisonInput;

    @Field(() => [FilterVideoInput], { nullable: true })
    AND?: FilterVideoInput[];
    @Field(() => [FilterVideoInput], { nullable: true })
    OR?: FilterVideoInput[];
    @Field(() => FilterVideoInput, { nullable: true })
    NOT?: FilterVideoInput;
}
