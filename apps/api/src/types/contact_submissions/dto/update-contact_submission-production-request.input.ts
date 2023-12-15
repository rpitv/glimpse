import { CreateContactSubmissionProductionRequestInput } from "./create-contact_submission-production-request.input";
import { InputType, PartialType } from "@nestjs/graphql";

/**
 * Input type for updateContactSubmissionProductionRequest mutation. Null values are not updated. To update a non-null
 *  value to null, explicitly pass null.
 */
@InputType()
export class UpdateContactSubmissionProductionRequestInput extends PartialType(
    CreateContactSubmissionProductionRequestInput
) {}
