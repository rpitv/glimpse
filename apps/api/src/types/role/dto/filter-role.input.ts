import { InputType } from "@nestjs/graphql";
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
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Role.
     */
    name?: StringComparisonInput;
    /**
     * Filter by the description of this Role.
     */
    description?: StringComparisonInput;
    /**
     * Filter by whether this Role should be displayed in the membership section on the website's "About Us" page.
     */
    displayInMembership?: BooleanComparisonInput;
    /**
     * Filter by whether this Role should be displayed in the leadership section on the website's "About Us" page.
     */
    displayInLeadership?: BooleanComparisonInput;

    AND?: FilterRoleInput[];
    OR?: FilterRoleInput[];
    NOT?: FilterRoleInput;
}
