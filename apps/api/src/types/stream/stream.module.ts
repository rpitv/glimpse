import { Module } from "@nestjs/common";
import { StreamResolver } from "./stream.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    providers: [StreamResolver],
    imports: [PrismaModule, ConfigModule]
})
export class StreamModule {}
