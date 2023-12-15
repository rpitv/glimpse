import { Module } from "@nestjs/common";
import { AlertLogResolver } from "./alert_log.resolver";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    providers: [AlertLogResolver],
    imports: [PrismaModule]
})
export class AlertLogModule {}
