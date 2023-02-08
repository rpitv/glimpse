import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../user/user.entity";
import { UseGuards } from "@nestjs/common";
import { GraphqlLocalAuthGuard } from "./GraphqlLocalAuthGuard.guard";
import { CurrentUser } from "./current-user.decarator";
import { Rule, RuleType } from "../casl/rules.decorator";

@Resolver(() => User)
export class AuthResolver {
    @UseGuards(GraphqlLocalAuthGuard)
    @Mutation(() => User)
    @Rule(RuleType.ReadOne, User, { name: "Local login" })
    async loginLocal(
        @Args("username") username: string,
        @Args("password") password: string,
        @CurrentUser() user: User
    ): Promise<User> {
        return user;
    }

    @Mutation(() => Boolean)
    async logout(@Context() ctx: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            ctx.req.logout((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}
