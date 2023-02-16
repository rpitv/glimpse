import { InputType, OmitType } from "@nestjs/graphql";
import { Video } from "../video.entity";

/**
 * Input type for createVideo mutation
 */
@InputType()
export class CreateVideoInput extends OmitType(Video, ["id"], InputType) {}
