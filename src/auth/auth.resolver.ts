import { Args, Context, Directive, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../types/user/user.entity";
import { UseFilters, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./LocalAuthGuard.guard";
import { CurrentUser } from "./current-user.decarator";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { OAuthExceptionFilter } from "./OAuthException.filter";

@Resolver(() => User)
export class AuthResolver {
    constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

    @UseGuards(LocalAuthGuard)
    @UseFilters(OAuthExceptionFilter)
    @Mutation(() => User)
    @Directive('@rule(ruleType: ReadOne, subject: User, options: { name: "Local login", defer: true })')
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
            ctx.req.logout(async (err) => {
                if (err) {
                    reject(err);
                } else {
                    // Regenerate the user's permissions
                    ctx.req.permissions = await this.caslAbilityFactory.createForUser(null);
                    ctx.req.user = null;
                    resolve(true);
                }
            });
        });
    }
}
