import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GraphqlLocalAuthGuard extends AuthGuard("local") {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        request.body = ctx.getArgs();
        return request;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext();
        request.body = ctx.getArgs();

        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(this.getRequest(context));
        return result;
    }
}
