import { Module } from "@nestjs/common";
import { AuditLogResolver } from "./audit_log.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    providers: [AuditLogResolver],
    imports: [PrismaModule],
})
export class AuditLogModule {}
