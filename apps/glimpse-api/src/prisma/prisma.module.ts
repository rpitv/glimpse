import {Module} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {PrismaInterceptor} from "./prisma.interceptor";
import {PrismaPlugin} from "./prisma.plugin";

@Module({
    providers: [PrismaService, PrismaInterceptor, PrismaPlugin],
    exports: [PrismaService, PrismaInterceptor, PrismaPlugin]
})
export class PrismaModule {}
