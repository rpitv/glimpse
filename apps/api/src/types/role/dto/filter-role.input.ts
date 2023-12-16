import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { BooleanComparisonInput } from "../../../gql/boolean-comparison.input";

/**
 * Input type for filtering Roles in ReadMany queries.
 */
@InputType()
export class FilterRoleInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Role.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by the description of this Role.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    description?: StringComparisonInput;
    /**
     * Filter by whether this Role should be displayed in the membership section on the website's "About Us" page.
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    displayInMembership?: BooleanComparisonInput;
    /**
     * Filter by whether this Role should be displayed in the leadership section on the website's "About Us" page.
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    displayInLeadership?: BooleanComparisonInput;

    @Field(() => [FilterRoleInput], { nullable: true })
    AND?: FilterRoleInput[];
    @Field(() => [FilterRoleInput], { nullable: true })
    OR?: FilterRoleInput[];
    @Field(() => FilterRoleInput, { nullable: true })
    NOT?: FilterRoleInput;
}
