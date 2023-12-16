import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";
import {OrderDirection} from "../../../gql/order-direction.enum";

/**
 * Input type for filtering AccessLogs in ReadMany queries.
 */
@InputType()
export class FilterAccessLogInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by service name
     */
    @Field(() => StringComparisonInput, { nullable: true })
    service?: StringComparisonInput;
    /**
     * Filter by User ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    userId?: NumberComparisonInput;
    /**
     * Filter by timestamp
     */
    @Field(() => DateComparisonInput, { nullable: true })
    timestamp?: DateComparisonInput;
    /**
     * Filter by IP address
     */
    @Field(() => StringComparisonInput, { nullable: true })
    ip?: StringComparisonInput;

    @Field(() => [FilterAccessLogInput], { nullable: true })
    AND?: FilterAccessLogInput[];
    @Field(() => [FilterAccessLogInput], { nullable: true })
    OR?: FilterAccessLogInput[];
    @Field(() => FilterAccessLogInput, { nullable: true })
    NOT?: FilterAccessLogInput;
}
