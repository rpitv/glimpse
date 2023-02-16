import { InputType, OmitType } from "@nestjs/graphql";
import { Image } from "../image.entity";

/**
 * Input type for createImage mutation
 */
@InputType()
export class CreateImageInput extends OmitType(Image, ["id"], InputType) {}
