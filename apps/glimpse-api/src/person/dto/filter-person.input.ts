import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering Persons in ReadMany queries.
 */
@InputType()
export class FilterPersonInput {
    /**
     * Filter by ID
     */
    id?: NumberComparisonInput;
    /**
     * Filter by when the blog post was posted.
     */
    postedAt?: DateComparisonInput;
    /**
     * Filter by title
     */
    title?: StringComparisonInput;
    /**
     * Filter by author ID
     */
    authorId?: NumberComparisonInput;
    /**
     * Filter by author display name
     */
    authorDisplayName?: StringComparisonInput;

    AND?: FilterPersonInput[];
    OR?: FilterPersonInput[];
    NOT?: FilterPersonInput;
}
