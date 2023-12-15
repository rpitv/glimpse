import { InputType, OmitType } from "@nestjs/graphql";
import { Redirect } from "../redirect.entity";

/**
 * Input type for createRedirect mutation
 */
@InputType()
export class CreateRedirectInput extends OmitType(Redirect, ["id"], InputType) {}
