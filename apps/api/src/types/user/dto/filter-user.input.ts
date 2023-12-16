import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Users in ReadMany queries.
 */
@InputType()
export class FilterUserInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by email address
     */
    @Field(() => StringComparisonInput, { nullable: true })
    mail?: StringComparisonInput;
    /**
     * Filter by username
     */
    @Field(() => StringComparisonInput, { nullable: true })
    username?: StringComparisonInput;
    /**
     * Filter by Person ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    personId?: NumberComparisonInput;
    /**
     * Filter by joined date
     */
    @Field(() => DateComparisonInput, { nullable: true })
    joined?: DateComparisonInput;
    /**
     * Filter by Discord ID
     */
    @Field(() => StringComparisonInput, { nullable: true })
    discord?: StringComparisonInput;

    @Field(() => [FilterUserInput], { nullable: true })
    AND?: FilterUserInput[];
    @Field(() => [FilterUserInput], { nullable: true })
    OR?: FilterUserInput[];
    @Field(() => FilterUserInput, { nullable: true })
    NOT?: FilterUserInput;
}
