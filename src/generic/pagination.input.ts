import {Field, InputType, Int} from "@nestjs/graphql";

@InputType()
export default class PaginationInput {
    @Field(() => Int)
    take: number;
    @Field(() => Int, { nullable: true })
    skip?: number;
    @Field(() => Int, { nullable: true })
    cursor?: number;
}
