import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AuthException } from "./AuthException.exception";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: AuthException, host: ArgumentsHost): any {
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
