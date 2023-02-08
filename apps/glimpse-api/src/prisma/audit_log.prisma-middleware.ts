import {Injectable} from "@nestjs/common";
import {Prisma} from ".prisma/client";

@Injectable()
export class AuditLogPrismaMiddleware {

    async use<T>(params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<T>): Promise<T> {
        console.log(params);
        return next(params);
    }
}
