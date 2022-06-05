import {Authorized, Field, ID, Int, ObjectType} from "type-graphql";

@ObjectType()
class User {

    @Field(() => ID)
    id!: number;

    @Field()
    username!: string;

    @Field()
    mail!: string;

    @Field({ nullable: true })
    discord?: string;

    @Field({ nullable: true })
    password?: string;

    @Field()
    joined!: Date;

    // @Authorized("glimpse:query:access_log:@:ip:read")
    // @Field(() => Person)
    // person?: Person;
}

export { User };
