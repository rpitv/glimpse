import { Strategy, Profile } from "passport-discord";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { User } from "../types/user/user.entity";
import {CaslAbilityFactory} from "../casl/casl-ability.factory";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private caslAbilityFactory: CaslAbilityFactory) {
        super({
            authorizationURL: "https://discord.com/api/oauth2/authorize",
            tokenURL: "https://discord.com/api/oauth2/token",
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ["identify"],
            state: true,
            store: true,
            passReqToCallback: true
        });
    }

    async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
        const user = await this.authService.verifyDiscordCallback(req, profile.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        // Regenerate the user's permissions
        req.permissions = await this.caslAbilityFactory.createForUser(user);
        return user;
    }
}
