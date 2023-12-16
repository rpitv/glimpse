import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering VoteResponses in ReadMany queries.
 */
@InputType()
export class FilterVoteResponseInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by user ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    userId?: NumberComparisonInput;
    /**
     * Filter by vote ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    voteId?: NumberComparisonInput;
    /**
     * Filter by when they voted
     */
    @Field(() => DateComparisonInput, { nullable: true })
    timestamp?: DateComparisonInput;
    /**
     * Filter by their selection
     */
    @Field(() => StringComparisonInput, { nullable: true })
    selection?: StringComparisonInput;

    @Field(() => [FilterVoteResponseInput], { nullable: true })
    AND?: FilterVoteResponseInput[];
    @Field(() => [FilterVoteResponseInput], { nullable: true })
    OR?: FilterVoteResponseInput[];
    @Field(() => FilterVoteResponseInput, { nullable: true })
    NOT?: FilterVoteResponseInput;
}
