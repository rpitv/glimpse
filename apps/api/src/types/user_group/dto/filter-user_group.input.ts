import { InputType } from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering UserGroups in ReadMany queries.
 */
@InputType()
export class FilterUserGroupInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by User ID
     */
    userId?: NumberComparisonInput;
    /**
     * Filter by Group ID
     */
    groupId?: NumberComparisonInput;

    AND?: FilterUserGroupInput[];
    OR?: FilterUserGroupInput[];
    NOT?: FilterUserGroupInput;
}
