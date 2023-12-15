import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    private readonly logger: Logger = new Logger("LocalAuthGuard");

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
            throw new Error('Unsupported context type "' + context.getType() + '"');
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
}
