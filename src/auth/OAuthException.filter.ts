import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { OAuthException } from "./OAuthException.exception";
import { HttpAdapterHost } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly configService: ConfigService) {}

    catch(exception: OAuthException, host: ArgumentsHost): any {
        if (host.getType() === "http") {
            const { httpAdapter } = this.httpAdapterHost;
            const ctx = host.switchToHttp();
            const redirectCookieName = this.configService.get<string>("LOGIN_REDIRECT_COOKIE_NAME");
            const redirect = ctx.getRequest().cookies[redirectCookieName];
            const failureRedirect = this.configService.get<string>("OAUTH_FAIL_REDIRECT");
            if (redirect) {
                ctx.getResponse().clearCookie(redirectCookieName);
                httpAdapter.redirect(
                    ctx.getResponse(),
                    302,
                    `${failureRedirect}?error=${exception.type}&redirect=${encodeURIComponent(redirect)}`
                );
            } else {
                httpAdapter.redirect(ctx.getResponse(), 302, `${failureRedirect}?error=${exception.type}`);
            }
        }

        return exception;
    }
}
