import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Votes in ReadMany queries.
 */
@InputType()
export class FilterVoteInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by question
     */
    @Field(() => StringComparisonInput, { nullable: true })
    question?: StringComparisonInput;
    /**
     * Filter by expiry datetime
     */
    @Field(() => DateComparisonInput, { nullable: true })
    expires?: DateComparisonInput;
    /**
     * Filter by description
     */
    @Field(() => StringComparisonInput, { nullable: true })
    description?: StringComparisonInput;

    @Field(() => [FilterVoteInput], { nullable: true })
    AND?: FilterVoteInput[];
    @Field(() => [FilterVoteInput], { nullable: true })
    OR?: FilterVoteInput[];
    @Field(() => FilterVoteInput, { nullable: true })
    NOT?: FilterVoteInput;
}
