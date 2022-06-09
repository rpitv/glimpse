import {prisma} from "../prisma";
import type {NextFunction, Request, Response} from "express";

/**
 * Middleware to inject the "permissions", "prisma", and "user" values into the Express Request object.
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next function, to move to the next middleware
 */
export async function injectRequestProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.prisma = prisma;

    if(req.session.userId) {
        const userResponse = await prisma.user.findUnique({
            where: {
                id: req.session.userId
            }
        })
        if(userResponse) {
            // req.user = userResponse;
        }
    }

    if(!req.session.permissionJSON) {
        // req.session.permissionJSON = await getPermissions(req.user);
    }
    req.permissions = undefined; // new Ability(req.session.permissionJSON)
    next();
}
