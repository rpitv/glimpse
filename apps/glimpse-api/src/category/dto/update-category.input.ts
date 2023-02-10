import { CreateCategoryInput } from "./create-category.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateCategory mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
