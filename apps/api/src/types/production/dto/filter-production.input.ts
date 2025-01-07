import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import {BooleanComparisonInput} from "../../../gql/boolean-comparison.input";

/**
 * Input type for filtering Productions in ReadMany queries.
 */
@InputType()
export class FilterProductionInput {
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
     * Filter by description
     */
    @Field(() => StringComparisonInput, { nullable: true })
    description?: StringComparisonInput;
    /**
     * Filter by start time
     */
    @Field(() => DateComparisonInput, { nullable: true })
    startTime?: DateComparisonInput;
    /**
     * Filter by end time
     */
    @Field(() => DateComparisonInput, { nullable: true })
    endTime?: DateComparisonInput;
    /**
     * Filter by category ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    categoryId?: NumberComparisonInput;
    /**
     * Filter by closet location
     */
    @Field(() => StringComparisonInput, { nullable: true })
    closetLocation?: StringComparisonInput;
    /**
     * Filter by closet time
     */
    @Field(() => DateComparisonInput, { nullable: true })
    closetTime?: DateComparisonInput;
    /**
     * Filter by event location
     */
    @Field(() => StringComparisonInput, { nullable: true })
    eventLocation?: StringComparisonInput;
    /**
     * Filter by team notes
     */
    @Field(() => StringComparisonInput, { nullable: true })
    teamNotes?: StringComparisonInput;
    /**
     * Filter by thumbnail Image ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    thumbnailId?: NumberComparisonInput;
    /**
     * Filter by whether the Production uses Discord
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    useDiscord?: BooleanComparisonInput;

    @Field(() => [FilterProductionInput], { nullable: true })
    AND?: FilterProductionInput[];
    @Field(() => [FilterProductionInput], { nullable: true })
    OR?: FilterProductionInput[];
    @Field(() => FilterProductionInput, { nullable: true })
    NOT?: FilterProductionInput;
}
