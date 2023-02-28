import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { OAuthException } from "./OAuthException.exception";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DiscordAuthGuard extends AuthGuard("discord") {
    private readonly logger: Logger = new Logger("DiscordAuthGuard");

    constructor(private readonly configService: ConfigService) {
        super();
    }

    getRequest(context: ExecutionContext) {
        if (context.getType() === "http") {
            return context.switchToHttp().getRequest();
        } else if (context.getType<GqlContextType>() === "graphql") {
            const ctx = GqlExecutionContext.create(context);
            const request = ctx.getContext().req;
            this.logger.debug("Replacing request body with graphql args");
            request.body = ctx.getArgs();
            return request;
        } else {
            throw new Error(`Unsupported context type "${context.getType()}"`);
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        if (!result) {
            return false;
        }
        await super.logIn(this.getRequest(context));
        return result;
    }

    handleRequest<T>(err: any, user: T): T {
        if (err?.message === 'Invalid "code" in request.') {
            throw new OAuthException("invalid_code");
        }
        if (!user) {
            throw new OAuthException("no_user");
        }
        if (err) {
            throw new OAuthException("server_error", err);
        }
        return user;
    }

    getAuthenticateOptions(context: ExecutionContext): any {
        const ctx = context.switchToHttp();
        const { redirect } = ctx.getRequest().query;
        if (redirect) {
            const redirectCookieName = this.configService.get<string>("LOGIN_REDIRECT_COOKIE_NAME");
            ctx.getResponse<Response>().cookie(redirectCookieName, redirect, {
                expires: new Date(new Date().getTime() + 600000) // 10 minutes
            });
        }
        return {};
    }
}
