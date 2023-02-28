import { Controller, Get, Redirect, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { DiscordAuthGuard } from "./DiscordAuthGuard.guard";
import { OAuthExceptionFilter } from "./OAuthException.filter";

@Controller("auth")
export class AuthController {
    @Get("discord")
    @UseGuards(DiscordAuthGuard)
    @UseFilters(OAuthExceptionFilter)
    @Redirect()
    discordAuth(@Req() req: Request, @Res() res: Response): { url: string } {
        // If user does not provide a code in the request, passport-discord will redirect them to Discord login page.
        const redirect = req.cookies["glimpse.redirect"] || "/";
        res.clearCookie("glimpse.redirect");
        return { url: redirect };
    }
}
