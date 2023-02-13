import { InputType, OmitType } from "@nestjs/graphql";
import { Category } from "../category.entity";

/**
 * Input type for createCategory mutation
 */
@InputType()
export class CreateCategoryInput extends OmitType(Category, ["id"], InputType) {}
