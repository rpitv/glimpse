import { InputType, OmitType } from "@nestjs/graphql";
import { ContactSubmission } from "../contact_submission.entity";

/**
 * Input type for createContactSubmission mutation
 */
@InputType()
export class CreateContactSubmissionInput extends OmitType(ContactSubmission, ["id", "timestamp"], InputType) {}
