import { InputType } from "@nestjs/graphql";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";

/**
 * Input type for filtering PersonImages in ReadMany queries.
 */
@InputType()
export class FilterPersonImageInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by person ID
     */
    personId?: NumberComparisonInput;
    /**
     * Filter by image ID
     */
    imageId?: NumberComparisonInput;

    AND?: FilterPersonImageInput[];
    OR?: FilterPersonImageInput[];
    NOT?: FilterPersonImageInput;
}
