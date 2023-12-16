import {Field, InputType} from "@nestjs/graphql";
import {ContactSubmissionType} from "@prisma/client";

type EnumValues = typeof ContactSubmissionType[keyof typeof ContactSubmissionType]

@InputType()
export class ContactSubmissionTypeComparisonInput {
    @Field(() => ContactSubmissionType, { nullable: true })
    equals?: EnumValues;
    @Field(() => [ContactSubmissionType], { nullable: true })
    in?: EnumValues[];
    @Field(() => [ContactSubmissionType], { nullable: true })
    notIn?: EnumValues[];
    @Field(() => ContactSubmissionTypeComparisonInput, { nullable: true })
    not?: ContactSubmissionTypeComparisonInput;
}
