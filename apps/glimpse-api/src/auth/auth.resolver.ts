import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {User} from "../user/user.entity";
import {UseGuards} from "@nestjs/common";
import {GraphqlLocalAuthGuard} from "./GraphqlLocalAuthGuard.guard";
import {CurrentUser} from "./current-user.decarator";

@Resolver(() => User)
export class AuthResolver {

    @UseGuards(GraphqlLocalAuthGuard)
    @Mutation(() => User)
    async login(@Args('username') username: string, @Args('password') password: string, @CurrentUser() user: User): Promise<User> {
        return user;
    }
}
