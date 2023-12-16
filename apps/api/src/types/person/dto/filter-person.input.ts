import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Persons in ReadMany queries.
 */
@InputType()
export class FilterPersonInput {
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
     * Filter by graduation
     */
    @Field(() => DateComparisonInput, { nullable: true })
    graduation?: DateComparisonInput;

    @Field(() => [FilterPersonInput], { nullable: true })
    AND?: FilterPersonInput[];
    @Field(() => [FilterPersonInput], { nullable: true })
    OR?: FilterPersonInput[];
    @Field(() => FilterPersonInput, { nullable: true })
    NOT?: FilterPersonInput;
}
