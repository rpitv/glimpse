import { InputType, OmitType } from "@nestjs/graphql";
import {BlogPost} from "../blog_post.entity";

/**
 * Input type for createBlogPost mutation
 */
@InputType()
export class CreateBlogPostInput extends OmitType(BlogPost, ["id"], InputType) {}
