import {Authorized, Field, ID, ObjectType} from "type-graphql";
import {User} from "./User";

@ObjectType()
class AccessLog {

    @Authorized("glimpse:query:access_log:@:id:read")
    @Field(() => ID)
    id!: number;

    @Field()
    service!: string;

    @Field()
    timestamp!: Date;

    @Field({ nullable: true })
    ip?: string;

    @Field()
    user!: User
}

export { AccessLog };
