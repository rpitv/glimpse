import { Module } from "@nestjs/common";
import { AccessLogResolver } from "./access_log.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [AccessLogResolver],
    imports: [PrismaModule]
})
export class AccessLogModule {}
