import {FieldMiddleware, MiddlewareContext, NextFn} from "@nestjs/graphql";
import {AbilityAction} from "./casl-ability.factory";
import {ForbiddenException} from "@nestjs/common";

export const caslMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    const req = ctx.context.req;
    const { fieldName, parentType } = ctx.info;

    // If this is not a top-level field, then infer permission checks based on parent name and field name.
    //  Action is always "read", since this isn't an input type. For top-level field checks, see @Rules() interceptor.
    if(!["Query", "Mutation", "Subscription"].includes(parentType.name)) {
        if(!req.permissions.can(AbilityAction.Read, parentType.name, fieldName)) {
            throw new ForbiddenException();
        }
    }

    // Post-method value checks are checked within the interceptor.
    return await next();
};
