import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering Redirects in ReadMany queries.
 */
@InputType()
export class FilterRedirectInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by Redirect key, used in URLs.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    key?: StringComparisonInput;
    /**
     * Filter by Redirect location. User is redirected to this URL.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    location?: StringComparisonInput;
    /**
     * Filter by when the Redirect expires.
     */
    @Field(() => DateComparisonInput, { nullable: true })
    expires?: DateComparisonInput;

    @Field(() => [FilterRedirectInput], { nullable: true })
    AND?: FilterRedirectInput[];
    @Field(() => [FilterRedirectInput], { nullable: true })
    OR?: FilterRedirectInput[];
    @Field(() => FilterRedirectInput, { nullable: true })
    NOT?: FilterRedirectInput;
}
