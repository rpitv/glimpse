import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
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

  handleRequest<T>(err: any, user: T): T {
    if (err?.message === 'Invalid "code" in request.') {
      throw new HttpException('Invalid "code" in request.', 400);
    }
    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }
    if (err) {
      throw new HttpException(err, 500);
    }
    return user;
  }

  getAuthenticateOptions(context: ExecutionContext): any {
    const ctx = context.switchToHttp();
    const { redirect } = ctx.getRequest().query;
    return { state: { redirect } }
  }

}
