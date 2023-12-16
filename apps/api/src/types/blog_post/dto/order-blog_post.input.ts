import {Field, InputType, registerEnumType} from "@nestjs/graphql";
import { OrderDirection } from "../../../gql/order-direction.enum";
import {NumberComparisonInput} from "../../../gql/number-comparison.input";

enum BlogPostOrderableFields {
    id = "id",
    postedAt = "postedAt",
    title = "title"
}

registerEnumType(BlogPostOrderableFields, {
    name: "BlogPostOrderableFields"
});

/**
 * Input type for ordering BlogPosts in ReadMany queries.
 */
@InputType()
export class OrderBlogPostInput {
    /**
     * Name of the field to sort by.
     */
    @Field(() => BlogPostOrderableFields)
    field: BlogPostOrderableFields;
    /**
     * Direction to order in. Required.
     */
    @Field(() => OrderDirection)
    direction: OrderDirection;
}
