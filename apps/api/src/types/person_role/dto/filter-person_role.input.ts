import {Field, InputType} from "@nestjs/graphql";
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
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by Person ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    personId?: NumberComparisonInput;
    /**
     * Filter by Role ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    roleId?: NumberComparisonInput;
    /**
     * Filter by the start time of the PersonRole
     */
    @Field(() => DateComparisonInput, { nullable: true })
    startTime?: DateComparisonInput;
    /**
     * Filter by the end time of the PersonRole
     */
    @Field(() => DateComparisonInput, { nullable: true })
    endTime?: DateComparisonInput;

    @Field(() => [FilterPersonRoleInput], { nullable: true })
    AND?: FilterPersonRoleInput[];
    @Field(() => [FilterPersonRoleInput], { nullable: true })
    OR?: FilterPersonRoleInput[];
    @Field(() => FilterPersonRoleInput, { nullable: true })
    NOT?: FilterPersonRoleInput;
}
