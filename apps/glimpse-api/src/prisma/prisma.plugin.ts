import { ApolloServerPlugin, GraphQLRequestListener } from "apollo-server-plugin-base";
import { Plugin } from "@nestjs/apollo";
import { PrismaService } from "./prisma.service";
import { Logger } from "@nestjs/common";

@Plugin()
export class PrismaPlugin implements ApolloServerPlugin {
    private logger: Logger = new Logger("PrismaPlugin");
    constructor(private readonly prisma: PrismaService) {}

    async requestDidStart(ctx): Promise<GraphQLRequestListener> {
        this.logger.verbose("Creating Prisma transaction...");
        let endTransaction: () => void;

        await new Promise<void>((continueRequest) => {
            this.prisma.$transaction(async (tx) => {
                ctx.context.req.prismaTx = tx;
                this.logger.verbose("Prisma transaction created.");
                continueRequest();

                await new Promise<void>((resolve) => {
                    endTransaction = () => {
                        this.logger.verbose("Prisma transaction completed.");
                        resolve();
                    };
                });
            });
        });

        return {
            async willSendResponse() {
                endTransaction();
            }
        };
    }
}
