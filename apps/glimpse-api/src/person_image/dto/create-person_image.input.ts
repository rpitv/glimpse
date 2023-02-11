import { InputType, OmitType } from "@nestjs/graphql";
import { PersonImage } from "../person_image.entity";

/**
 * Input type for createPersonImage mutation
 */
@InputType()
export class CreatePersonImageInput extends OmitType(PersonImage, ["id"], InputType) {}
