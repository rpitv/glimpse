import { InputType, OmitType } from "@nestjs/graphql";
import { ContactSubmission } from "../contact_submission.entity";

/**
 * Input type for createContactSubmissionGeneral mutation
 */
@InputType()
export class CreateContactSubmissionGeneralInput extends OmitType(
    ContactSubmission,
    ["id", "timestamp", "additionalData", "type"],
    InputType
) {}
