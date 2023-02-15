import { InputType, OmitType } from "@nestjs/graphql";
import { Stream } from "../stream.entity";

/**
 * Input type for createCategory mutation
 */
@InputType()
export class CreateStreamInput extends OmitType(Stream, ["id", "message"], InputType) {}
