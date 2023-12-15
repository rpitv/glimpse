import { InputType, PartialType } from "@nestjs/graphql";
import { CreateContactSubmissionGeneralInput } from "./create-contact_submission-general.input";

/**
 * Input type for updateContactSubmissionGeneral mutation. Null values are not updated. To update a non-null
 *  value to null, explicitly pass null.
 */
@InputType()
export class UpdateContactSubmissionGeneralInput extends PartialType(CreateContactSubmissionGeneralInput) {}
