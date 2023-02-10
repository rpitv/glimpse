import { CreateContactSubmissionInput } from "./create-contact_submission.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateContactSubmission mutation. Null values are not updated. To update a non-null value to null, explicitly
 *  pass null.
 */
@InputType()
export class UpdateContactSubmissionInput extends PartialType(CreateContactSubmissionInput) {}
