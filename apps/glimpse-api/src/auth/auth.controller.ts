import { Controller, Get, Redirect, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { DiscordAuthGuard } from "./DiscordAuthGuard.guard";

@Controller("auth")
export class AuthController {
    @Get("discord")
    @UseGuards(DiscordAuthGuard)
    @Redirect()
    discordAuth(@Req() req: Request): { url: string } {
        // If user does not provide a code in the request, passport-discord will redirect them to Discord login page.
        req.session.loginMethod = "discord";
        return { url: req.authInfo?.state?.redirect || "/" };
    }
}
