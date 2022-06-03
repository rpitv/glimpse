import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class AccessLog {
    @Field(() => ID)
    id!: number;

    @Field()
    service!: string;

    @Field()
    timestamp!: Date;

    @Field({ nullable: true })
    ip?: string;

    // @Field()
    // user!: User
}

export { AccessLog };
