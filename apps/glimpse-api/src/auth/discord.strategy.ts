import { Strategy, Profile } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User} from "@prisma/client";
import {Request} from "express";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            authorizationURL: 'https://discord.com/api/oauth2/authorize',
            tokenURL: 'https://discord.com/api/oauth2/token',
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ['identify'],
            state: true,
            store: true,
            passReqToCallback: true
        });
    }

    async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
        req.session.discordAccessToken = accessToken;
        req.session.discordRefreshToken = refreshToken;
        const user = this.authService.verifyDiscordCallback(profile.id, accessToken, refreshToken);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
