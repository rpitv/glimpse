import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import {AuditLogPrismaMiddleware} from "./audit_log.prisma-middleware";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor(private readonly auditLogMiddleware: AuditLogPrismaMiddleware) {
        super();
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
        this.$use(this.auditLogMiddleware.use);
    }

    async enableShutdownHooks(app: INestApplication): Promise<void> {
        this.$on("beforeExit", async () => {
            await app.close();
        });
    }
}
