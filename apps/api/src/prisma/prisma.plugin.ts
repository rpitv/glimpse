import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { PrismaService } from "./prisma.service";
import { Logger } from "@nestjs/common";

/**
 * Apollo plugin that creates a Prisma transaction for the duration of the request. This allows us to easily revert any
 *  changes made to the database if a system or permissions error occurs.
 *
 *  This is only for GraphQL requests. HTTP requests (and all other request types) are handled by the PrismaInterceptor.
 *  A plugin exists specifically for GraphQL because NestJS interceptors currently seem to only encapsulate the
 *  first/top-level resolver, and not the entire request.
 *
 *  Typically, singular queries are implicitly wrapped in a transaction, so any locks only last however long the query
 *  takes to execute. However, we are explicitly wrapping all queries within the request in a transaction, so any locks
 *  will persist for the duration of the request. This could be a pretty serious downside, but it's the simplest way to
 *  implement this kind of request-wide rollback. We will have to evaluate the implementation of this if performance
 *  becomes a problem under heavy user load, or if we ever need to perform expensive tasks within a single request.
 *
 *  @see {@link https://www.prisma.io/docs/concepts/components/prisma-client/transactions}
 *  @see {@link https://www.postgresql.org/docs/current/transaction-iso.html}
 *  @see {@link https://github.com/nestjs/graphql/issues/631}
 *  @see {@link PrismaInterceptor}
 */
@Plugin()
export class PrismaPlugin implements ApolloServerPlugin {
    private logger: Logger = new Logger("PrismaPlugin");
    constructor(private readonly prisma: PrismaService) {}

    async requestDidStart(ctx): Promise<GraphQLRequestListener<unknown>> {
        this.logger.verbose("Creating Prisma transaction...");
        let endTransaction: () => void;
        let failTransaction: (err: any) => void;

        await new Promise<void>((continueRequest) => {
            this.prisma
                .$transaction(
                    async (tx) => {
                        ctx.contextValue.req.prismaTx = tx;
                        this.logger.verbose("Prisma transaction created.");
                        continueRequest();

                        await new Promise<void>((resolve, reject) => {
                            endTransaction = () => {
                                this.logger.verbose("Prisma transaction completed.");
                                resolve();
                            };
                            failTransaction = (err) => {
                                this.logger.error("Prisma transaction failed.", err);
                                reject(err);
                            };
                        });
                    },
                    {
                        timeout: 2000
                    }
                )
                .catch((err) => {
                    failTransaction(err);
                });
        });

        return {
            async willSendResponse() {
                endTransaction();
            }
        };
    }
}
