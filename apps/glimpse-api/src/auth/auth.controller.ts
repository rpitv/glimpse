import {Controller, Get, Redirect, Req} from "@nestjs/common";
import {Request} from "express";

@Controller('auth')
export class AuthController {

    @Get('discord')
    @Redirect()
    initializeDiscord(@Req() req: Request): {url: string, statusCode: number} {
        const currentUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
        const callbackUrl = `${currentUrl}/callback`
        return {
            url: `https://discord.com/api/oauth2/authorize?client_id=882635889673633842&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=identify`,
            statusCode: 302
        }
    }

    @Get('discord/callback')
    @Redirect()
    completeDiscord(@Req() req: Request): {url: string, statusCode: number} {
        const currentUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
        const callbackUrl = `${currentUrl}/callback`
        return {
            url: `https://discord.com/api/oauth2/authorize?client_id=882635889673633842&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=identify`,
            statusCode: 302
        }
    }
}
