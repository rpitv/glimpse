import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

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

    AND?: FilterRoleInput[];
    OR?: FilterRoleInput[];
    NOT?: FilterRoleInput;
}
