import { Strategy, Profile } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User} from "@prisma/client";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ['identify'],
            state: true
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
        const user = this.authService.verifyDiscordCallback(profile.id, accessToken, refreshToken);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
