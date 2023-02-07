import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {Observable, tap} from "rxjs";
import {PrismaService} from "./prisma.service";
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";
import {Request} from "express";

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger("PrismaInterceptor");

    constructor(private readonly prisma: PrismaService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // Get the request object from the context. Currenntly only HTTP and GraphQL are supported.
        let req: Request;
        if(context.getType<GqlContextType>() === "graphql") {
            req = GqlExecutionContext.create(context).getContext().req;
        } else if(context.getType<GqlContextType>() === "http") {
            req = context.switchToHttp().getRequest();
        } else {
            this.logger.debug(`Context type ${context.getType<GqlContextType>()} not supported by PrismaInterceptor.`);
            throw new Error("Unsupported context type");
        }

        this.logger.verbose('Creating Prisma transaction...');
        let closePrismaTx: () => void;

        // Create and await for a Prisma transaction.
        await new Promise(resolve => {
            this.prisma.$transaction<void>(async (tx) => {
                this.logger.verbose('Prisma transaction created.');
                req.prismaTx = tx;
                // Resolve the upper Promise, allowing the request to continue.
                resolve(undefined);

                // Create another Promise and save the resolve function to be called when closePrismaTx is called.
                await new Promise(resolve => {
                    closePrismaTx = () => {
                        this.logger.verbose('Prisma transaction completed.');
                        resolve(undefined);
                    }
                })
                // Transaction scope ends here, so transaction closes now.
            });
        })

        // Call closePrismaTx, closing the transaction, when this request (observable) is completed.
        return next.handle().pipe(tap({
            complete: () => closePrismaTx()
        }));
    }

}
