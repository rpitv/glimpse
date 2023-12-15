import { Field, InputType, Int, OmitType } from "@nestjs/graphql";
import { ContactSubmission } from "../contact_submission.entity";
import { IsBoolean, IsDate, IsNumber, IsString, MaxLength } from "class-validator";

/**
 * Input type for createContactSubmissionProductionRequest mutation
 */
@InputType()
export class CreateContactSubmissionProductionRequestInput extends OmitType(
    ContactSubmission,
    ["id", "timestamp", "additionalData", "type"],
    InputType
) {
    @IsString()
    @MaxLength(300)
    location: string;
    @IsString()
    @MaxLength(300)
    organizationName: string;
    @IsDate()
    startTime: Date;
    @IsDate()
    endTime: Date;
    @IsBoolean()
    livestreamed: boolean;
    @IsBoolean()
    isPublic: boolean;
    @IsBoolean()
    audioAvailable: boolean;
    @IsBoolean()
    isStudentOrganization: boolean;
    @IsBoolean()
    requiresEditing: boolean;
    @IsNumber()
    @Field(() => Int, { nullable: true })
    requiredCameraCount: number | null;
    @IsString()
    @MaxLength(25)
    @Field(() => String, { nullable: true })
    phoneNumber: string | null;
}
