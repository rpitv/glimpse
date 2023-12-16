import {Field, InputType} from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering PersonImages in ReadMany queries.
 */
@InputType()
export class FilterPersonImageInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by person ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    personId?: NumberComparisonInput;
    /**
     * Filter by image ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    imageId?: NumberComparisonInput;

    @Field(() => [FilterPersonImageInput], { nullable: true })
    AND?: FilterPersonImageInput[];
    @Field(() => [FilterPersonImageInput], { nullable: true })
    OR?: FilterPersonImageInput[];
    @Field(() => FilterPersonImageInput, { nullable: true })
    NOT?: FilterPersonImageInput;
}
