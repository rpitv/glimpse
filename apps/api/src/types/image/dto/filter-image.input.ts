import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering Images in ReadMany queries.
 */
@InputType()
export class FilterImageInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by the name of this Image.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    name?: StringComparisonInput;
    /**
     * Filter by the path of this Image.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    path?: StringComparisonInput;
    /**
     * Filter by the description of this Image.
     */
    @Field(() => StringComparisonInput, { nullable: true })
    description?: StringComparisonInput;

    @Field(() => [FilterImageInput], { nullable: true })
    AND?: FilterImageInput[];
    @Field(() => [FilterImageInput], { nullable: true })
    OR?: FilterImageInput[];
    @Field(() => FilterImageInput, { nullable: true })
    NOT?: FilterImageInput;
}
