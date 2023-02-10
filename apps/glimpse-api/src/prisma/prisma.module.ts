import { Module } from "@nestjs/common";
import { AuditLogEntry, PrismaService } from "./prisma.service";
import { PrismaInterceptor } from "./prisma.interceptor";
import { AuditLog } from "../audit_log/audit_log.entity";

@Module({
    providers: [
        {
            provide: PrismaService,
            useFactory: () => {
                return new PrismaService().$extends({
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
        },
        PrismaInterceptor
    ],
    exports: [PrismaService, PrismaInterceptor]
})
export class PrismaModule {}
