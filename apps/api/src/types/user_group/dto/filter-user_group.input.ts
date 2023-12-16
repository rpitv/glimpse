import {Field, InputType} from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering UserGroups in ReadMany queries.
 */
@InputType()
export class FilterUserGroupInput {
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
     * Filter by Group ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    groupId?: NumberComparisonInput;

    @Field(() => [FilterUserGroupInput], { nullable: true })
    AND?: FilterUserGroupInput[];
    @Field(() => [FilterUserGroupInput], { nullable: true })
    OR?: FilterUserGroupInput[];
    @Field(() => FilterUserGroupInput, { nullable: true })
    NOT?: FilterUserGroupInput;
}
