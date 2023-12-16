import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import { BooleanComparisonInput } from "../../../gql/boolean-comparison.input";

/**
 * Input type for filtering ContactSubmissions in ReadMany queries.
 */
@InputType()
export class FilterContactSubmissionInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by the email of the person who submitted the ContactSubmission.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    email?: StringComparisonInput;
    /**
     * Filter by the name of the person who submitted the ContactSubmission.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by timestamp at which the ContactSubmission was created.
     */
    @Field(() => DateComparisonInput, { nullable: true })
    timestamp?: DateComparisonInput;
    /**
     * Filter by resolved status
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    resolved?: BooleanComparisonInput;

    @Field(() => [FilterContactSubmissionInput], { nullable: true })
    AND?: FilterContactSubmissionInput[];
    @Field(() => [FilterContactSubmissionInput], { nullable: true })
    OR?: FilterContactSubmissionInput[];
    @Field(() => FilterContactSubmissionInput, { nullable: true })
    NOT?: FilterContactSubmissionInput;
}
