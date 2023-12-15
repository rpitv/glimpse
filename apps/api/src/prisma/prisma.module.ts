import { Module } from "@nestjs/common";
import { AuditLogEntry, PrismaService } from "./prisma.service";
import { PrismaInterceptor } from "./prisma.interceptor";
import { PrismaPlugin } from "./prisma.plugin";
import { PrismaClient } from "@prisma/client";
import { AuditLog } from "../types/audit_log/audit_log.entity";

const prismaServiceProvider = {
    provide: PrismaService,
    useFactory: () => {
        const prisma = new PrismaClient();
        return prisma.$extends({
            client: {
                async genAuditLog(entry: AuditLogEntry[] | AuditLogEntry): Promise<AuditLog[] | AuditLog> {
                    if (Array.isArray(entry)) {
                        return Promise.all(entry.map((entry) => this.genAuditLog(entry)));
                    }

                    return await this.auditLog.create({
                        data: {
                            message: entry.displayText,
                            userId: entry.user?.id,
                            subject: entry.subject,
                            identifier: entry.id,
                            oldValue: entry.oldValue,
                            newValue: entry.newValue
                        }
                    });
                }
            }
        });
    }
};

@Module({
    providers: [prismaServiceProvider, PrismaInterceptor, PrismaPlugin],
    exports: [prismaServiceProvider, PrismaInterceptor, PrismaPlugin]
})
export class PrismaModule {}
