import {prisma} from "../prisma";
import type {NextFunction, Request, Response} from "express";
import {Ability, RawRule} from "@casl/ability";
import {PrismaClient} from "@prisma/client";

// Declare extensions to modules this app uses. Couldn't get any other way
//  to work. Nothing listed here worked:
//  https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare module 'express-session' {
    interface SessionData {
        permissionJSON?: RawRule[];
        userId?: number;
    }
}
declare module 'express-serve-static-core' {
    interface Request {
        permissions?: Ability;
        // user?: User;
        prisma: PrismaClient;
    }
}

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
