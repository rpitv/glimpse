import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class GraphqlLocalAuthGuard extends AuthGuard("local") {
    getRequest(context: ExecutionContext) {
        if(context.getType() === "http") {
            return context.switchToHttp().getRequest();
        } else if(context.getType<GqlContextType>() === "graphql") {
            const ctx = GqlExecutionContext.create(context);
            const request = ctx.getContext().req;
            request.body = ctx.getArgs();
            return request;
        } else {
            throw new Error("Unsupported context type \"" + context.getType() + "\"");
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);
        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(request);
        return result;
    }
}
