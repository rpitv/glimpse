import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import {OrderDirection} from "../../../gql/order-direction.enum";
import {FilterAccessLogInput} from "../../access_log/dto/filter-access_log.input";

/**
 * Input type for filtering AlertLogs in ReadMany queries.
 */
@InputType()
export class FilterAlertLogInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by message
     */
    @Field(() => StringComparisonInput, { nullable: true })
    message?: StringComparisonInput;
    /**
     * Filter by severity
     */
    @Field(() => StringComparisonInput, { nullable: true })
    severity?: StringComparisonInput;
    /**
     * Filter by timestamp
     */
    @Field(() => DateComparisonInput, { nullable: true })
    timestamp?: DateComparisonInput;

    @Field(() => [FilterAlertLogInput], { nullable: true })
    AND?: FilterAlertLogInput[];
    @Field(() => [FilterAlertLogInput], { nullable: true })
    OR?: FilterAlertLogInput[];
    @Field(() => FilterAlertLogInput, { nullable: true })
    NOT?: FilterAlertLogInput;
}
