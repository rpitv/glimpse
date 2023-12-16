import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class BooleanComparisonInput {
    @Field(() => Boolean, { nullable: true })
    equals?: boolean;
}
