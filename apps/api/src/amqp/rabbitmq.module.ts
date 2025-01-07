import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {RabbitMQService} from "./rabbitmq.service";

@Module({
    providers: [RabbitMQService],
    imports: [ConfigModule],
    exports: [RabbitMQService],
})
export class RabbitMQModule {}
