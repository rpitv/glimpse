import { InputType } from "@nestjs/graphql";

@InputType()
export class NumberComparisonInput {
    equals?: number;
    not?: number;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    in?: number[];
}
