import { InputType } from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering PersonRoles in ReadMany queries.
 */
@InputType()
export class FilterPersonRoleInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by Person ID
     */
    personId?: NumberComparisonInput;
    /**
     * Filter by Role ID
     */
    roleId?: NumberComparisonInput;
    /**
     * Filter by the start time of the PersonRole
     */
    startTime?: DateComparisonInput;
    /**
     * Filter by the end time of the PersonRole
     */
    endTime?: DateComparisonInput;

    AND?: FilterPersonRoleInput[];
    OR?: FilterPersonRoleInput[];
    NOT?: FilterPersonRoleInput;
}
