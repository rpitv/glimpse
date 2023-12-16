import {Field, InputType} from "@nestjs/graphql";
import { CaseSensitivity } from "./case-sensitivity.enum";

@InputType()
export class StringComparisonInput {
    @Field(() => String, { nullable: true })
    equals?: string;
    @Field(() => String, { nullable: true })
    not?: string;
    @Field(() => String, { nullable: true })
    contains?: string;
    @Field(() => String, { nullable: true })
    startsWith?: string;
    @Field(() => String, { nullable: true })
    endsWith?: string;
    @Field(() => [String], { nullable: true })
    in?: string[];
    @Field(() => CaseSensitivity, { nullable: true })
    mode?: CaseSensitivity;
}
