import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaInterceptor } from "./prisma.interceptor";
import {AuditLogPrismaMiddleware} from "./audit_log.prisma-middleware";

@Module({
    providers: [PrismaService, PrismaInterceptor, AuditLogPrismaMiddleware],
    exports: [PrismaService, PrismaInterceptor],
})
export class PrismaModule {}
