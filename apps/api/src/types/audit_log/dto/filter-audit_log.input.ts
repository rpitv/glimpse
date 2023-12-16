import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering AuditLogs in ReadMany queries.
 */
@InputType()
export class FilterAuditLogInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by the user who made the change
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    userId?: NumberComparisonInput;
    /**
     * Filter by the time the change was made
     */
    @Field(() => DateComparisonInput, { nullable: true })
    timestamp?: DateComparisonInput;
    /**
     * Filter by the changed subject type
     */
    @Field(() => StringComparisonInput, { nullable: true })
    subject?: StringComparisonInput;
    /**
     * Filter by the identifier of the object within the subject type (e.g. the ID of the user)
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    identifier?: NumberComparisonInput;

    @Field(() => [FilterAuditLogInput], { nullable: true })
    AND?: FilterAuditLogInput[];
    @Field(() => [FilterAuditLogInput], { nullable: true })
    OR?: FilterAuditLogInput[];
    @Field(() => FilterAuditLogInput, { nullable: true })
    NOT?: FilterAuditLogInput;
}
