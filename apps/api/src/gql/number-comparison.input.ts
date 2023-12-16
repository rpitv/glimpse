import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class NumberComparisonInput {
    @Field(() => Number, { nullable: true })
    equals?: number;
    @Field(() => Number, { nullable: true })
    not?: number;
    @Field(() => Number, { nullable: true })
    lt?: number;
    @Field(() => Number, { nullable: true })
    lte?: number;
    @Field(() => Number, { nullable: true })
    gt?: number;
    @Field(() => Number, { nullable: true })
    gte?: number;
    @Field(() => [Number], { nullable: true })
    in?: number[];
}
