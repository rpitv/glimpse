import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Categories in ReadMany queries.
 */
@InputType()
export class FilterCategoryInput {
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
     * Filter by priority
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    priority?: NumberComparisonInput;
    /**
     * Filter by parent category ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    parentId?: NumberComparisonInput;

    @Field(() => [FilterCategoryInput], { nullable: true })
    AND?: FilterCategoryInput[];
    @Field(() => [FilterCategoryInput], { nullable: true })
    OR?: FilterCategoryInput[];
    @Field(() => FilterCategoryInput, { nullable: true })
    NOT?: FilterCategoryInput;
}
