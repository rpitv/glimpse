import { InputType } from "@nestjs/graphql";

@InputType()
export class DateComparisonInput {
    equals?: Date;
    not?: Date;
    lt?: Date;
    lte?: Date;
    gt?: Date;
    gte?: Date;
}
