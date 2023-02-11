import { InputType } from "@nestjs/graphql";
import { StringComparisonInput } from "../../generic/string-comparison.input";
import { NumberComparisonInput } from "../../generic/number-comparison.input";
import { DateComparisonInput } from "../../generic/date-comparison.input";

/**
 * Input type for filtering PersonRoles in ReadMany queries.
 */
@InputType()
export class FilterPersonRoleInput {
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

    AND?: FilterPersonRoleInput[];
    OR?: FilterPersonRoleInput[];
    NOT?: FilterPersonRoleInput;
}
