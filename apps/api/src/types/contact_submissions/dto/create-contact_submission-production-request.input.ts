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
    @Field(() => String)
    location: string;
    @IsString()
    @MaxLength(300)
    @Field(() => String)
    organizationName: string;
    @IsDate()
    @Field(() => Date)
    startTime: Date;
    @IsDate()
    @Field(() => Date)
    endTime: Date;
    @IsBoolean()
    @Field(() => Boolean)
    livestreamed: boolean;
    @IsBoolean()
    isPublic: boolean;
    @Field(() => Boolean)
    @IsBoolean()
    @Field(() => Boolean)
    audioAvailable: boolean;
    @IsBoolean()
    @Field(() => Boolean)
    isStudentOrganization: boolean;
    @IsBoolean()
    @Field(() => Boolean)
    requiresEditing: boolean;
    @IsNumber()
    @Field(() => Int, { nullable: true })
    requiredCameraCount: number | null;
    @IsString()
    @MaxLength(25)
    @Field(() => String, { nullable: true })
    phoneNumber: string | null;
}
