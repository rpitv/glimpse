import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { BooleanComparisonInput } from "../../../gql/boolean-comparison.input";

/**
 * Input type for filtering UserPermissions in ReadMany queries.
 */
@InputType()
export class FilterUserPermissionInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by User ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    userId?: NumberComparisonInput;
    /**
     * Filter by permission action
     */
    @Field(() => StringComparisonInput, { nullable: true })
    action?: StringComparisonInput;
    /**
     * Filter by inverted status
     */
    @Field(() => BooleanComparisonInput, { nullable: true })
    inverted?: BooleanComparisonInput;
    /**
     * Filter by inverted permissions denial reason
     */
    @Field(() => StringComparisonInput, { nullable: true })
    reason?: StringComparisonInput;

    @Field(() => [FilterUserPermissionInput], { nullable: true })
    AND?: FilterUserPermissionInput[];
    @Field(() => [FilterUserPermissionInput], { nullable: true })
    OR?: FilterUserPermissionInput[];
    @Field(() => FilterUserPermissionInput, { nullable: true })
    NOT?: FilterUserPermissionInput;
}
