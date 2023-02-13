import { CreateBlogPostInput } from "./create-blog_post.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateBlogPost mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateBlogPostInput extends PartialType(CreateBlogPostInput) {}
