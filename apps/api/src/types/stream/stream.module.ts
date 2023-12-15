import { Module } from "@nestjs/common";
import { StreamResolver } from "./stream.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AMQPModule } from "../../amqp/amqp.module";

@Module({
    providers: [StreamResolver],
    imports: [PrismaModule, ConfigModule, AMQPModule]
})
export class StreamModule {}
