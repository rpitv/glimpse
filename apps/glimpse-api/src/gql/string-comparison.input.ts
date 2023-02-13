import { InputType } from "@nestjs/graphql";
import { CaseSensitivity } from "./case-sensitivity.enum";

@InputType()
export class StringComparisonInput {
    equals?: string;
    not?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: CaseSensitivity;
}
