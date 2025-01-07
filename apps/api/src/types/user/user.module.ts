import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { AuthModule } from "../../auth/auth.module";
import { PrismaModule } from "../../prisma/prisma.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";
import {UserRpcService} from "./user_rpc.service";
import {ConfigModule} from "@nestjs/config";

@Module({
    providers: [UserResolver, UserRpcService],
    imports: [AuthModule, PrismaModule, RabbitMQModule, ConfigModule],
    exports: [UserRpcService],
})
export class UserModule {}
