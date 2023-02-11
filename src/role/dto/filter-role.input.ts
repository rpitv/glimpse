import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";

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
     * Filter by the path of this Role.
     */
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Role.
     */
    description?: StringComparisonInput;

    AND?: FilterRoleInput[];
    OR?: FilterRoleInput[];
    NOT?: FilterRoleInput;
}
