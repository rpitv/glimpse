import { Controller, Get, Redirect, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { DiscordAuthGuard } from "./DiscordAuthGuard.guard";
import { OAuthExceptionFilter } from "./OAuthException.filter";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
    constructor(private readonly configService: ConfigService) {}

    @Get("discord")
    @UseGuards(DiscordAuthGuard)
    @UseFilters(OAuthExceptionFilter)
    @Redirect()
    discordAuth(@Req() req: Request, @Res() res: Response): { url: string } {
        // If user does not provide a code in the request, passport-discord will redirect them to Discord login page.

        const successRedirect = this.configService.get<string>("OAUTH_SUCCESS_REDIRECT");
        const redirectCookieName = this.configService.get<string>("LOGIN_REDIRECT_COOKIE_NAME");
        const redirect: string = req.cookies[redirectCookieName];
        res.clearCookie(redirectCookieName);

        if (redirect) {
            const trustedDomains = (this.configService.get<string>("LOGIN_REDIRECT_HOSTS") || "").split(",");
            // Regex to capture the domain of a string. If the string is an absolute URL, it will capture the domain of
            //  the URL. Otherwise, the regex will not match.
            const domainRegex = /^(?:[a-z+]+:)?\/\/([^\/]*)\/?/i;

            const regexResult = redirect.match(domainRegex);
            if (regexResult) {
                const redirectDomain = regexResult[1];
                if (trustedDomains.includes(redirectDomain)) {
                    return { url: redirect };
                }
            }
        }
        return { url: successRedirect };
    }
}
