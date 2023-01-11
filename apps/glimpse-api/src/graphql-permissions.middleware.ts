import {FieldMiddleware, MiddlewareContext, NextFn} from "@nestjs/graphql";

export const loggerMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    // TODO permission checks
    const value = await next();
    // TODO permission checks
    return value;
};
