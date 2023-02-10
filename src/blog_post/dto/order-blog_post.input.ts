import { InputType, registerEnumType } from "@nestjs/graphql";
import { OrderDirection } from "../../generic/order-direction.enum";

enum BlogPostOrderableFields {
    id = "id",
    postedAt = "postedAt",
    authorId = "authorId",
    authorDisplayName = "authorDisplayName",
    title = "title",
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
    field: BlogPostOrderableFields;
    /**
     * Direction to order in. Required.
     */
    direction: OrderDirection;
}
