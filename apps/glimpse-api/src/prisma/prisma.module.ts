import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaInterceptor } from "./prisma.interceptor";


@Module({
    providers: [PrismaService, PrismaInterceptor],
    exports: [PrismaService, PrismaInterceptor],
})
export class PrismaModule {}
