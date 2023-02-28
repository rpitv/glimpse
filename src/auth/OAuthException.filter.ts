import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { OAuthException } from "./OAuthException.exception";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(OAuthException)
export class OAuthExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: OAuthException, host: ArgumentsHost): any {
        if (host.getType() === "http") {
            const { httpAdapter } = this.httpAdapterHost;
            const ctx = host.switchToHttp();
            const redirect = ctx.getRequest().cookies["glimpse.redirect"];
            if (redirect) {
                ctx.getResponse().clearCookie("glimpse.redirect");
                httpAdapter.redirect(
                    ctx.getResponse(),
                    302,
                    `/login?error=${exception.type}&redirect=${encodeURIComponent(redirect)}`
                );
            } else {
                httpAdapter.redirect(ctx.getResponse(), 302, `/login?error=${exception.type}`);
            }
        }

        return exception;
    }
}
