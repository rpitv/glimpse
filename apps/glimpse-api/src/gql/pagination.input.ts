import { Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export default class PaginationInput {
    @Field(() => Int)
    take: number;
    @Field(() => Int, { nullable: true })
    skip?: number;
    @Field(() => ID, { nullable: true })
    cursor?: string;
}
