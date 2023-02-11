import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import {BooleanComparisonInput} from "../../generic/boolean-comparison.input";

/**
 * Input type for filtering GroupPermissions in ReadMany queries.
 */
@InputType()
export class FilterGroupPermissionInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by group ID
     */
    groupId?: NumberComparisonInput;
    /**
     * Filter by permission action
     */
    action?: StringComparisonInput;
    /**
     * Filter by inverted status
     */
    inverted?: BooleanComparisonInput;
    /**
     * Filter by inverted permissions denial reason
     */
    reason?: StringComparisonInput;

    AND?: FilterGroupPermissionInput[];
    OR?: FilterGroupPermissionInput[];
    NOT?: FilterGroupPermissionInput;
}
