import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Groups in ReadMany queries.
 */
@InputType()
export class FilterGroupInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by name
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by parent group ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    parentId?: NumberComparisonInput;

    @Field(() => [FilterGroupInput], { nullable: true })
    AND?: FilterGroupInput[];
    @Field(() => [FilterGroupInput], { nullable: true })
    OR?: FilterGroupInput[];
    @Field(() => FilterGroupInput, { nullable: true })
    NOT?: FilterGroupInput;
}
