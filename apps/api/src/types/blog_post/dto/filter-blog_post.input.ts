import {Field, InputType} from "@nestjs/graphql";
import { StringComparisonInput } from "../../../gql/string-comparison.input";
import { NumberComparisonInput } from "../../../gql/number-comparison.input";
import { DateComparisonInput } from "../../../gql/date-comparison.input";

/**
 * Input type for filtering BlogPosts in ReadMany queries.
 */
@InputType()
export class FilterBlogPostInput {
    /**
     * Filter by ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    id?: NumberComparisonInput;
    /**
     * Filter by when the blog post was posted.
     */
    @Field(() => DateComparisonInput, { nullable: true })
    postedAt?: DateComparisonInput;
    /**
     * Filter by title
     */
    @Field(() => StringComparisonInput, { nullable: true })
    title?: StringComparisonInput;
    /**
     * Filter by author ID
     */
    @Field(() => NumberComparisonInput, { nullable: true })
    authorId?: NumberComparisonInput;
    /**
     * Filter by author display name
     */
    @Field(() => StringComparisonInput, { nullable: true })
    authorDisplayName?: StringComparisonInput;

    @Field(() => [FilterBlogPostInput], { nullable: true })
    AND?: FilterBlogPostInput[];
    @Field(() => [FilterBlogPostInput], { nullable: true })
    OR?: FilterBlogPostInput[];
    @Field(() => FilterBlogPostInput, { nullable: true })
    NOT?: FilterBlogPostInput;
}
