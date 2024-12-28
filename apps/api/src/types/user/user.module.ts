import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { AuthModule } from "../../auth/auth.module";
import { PrismaModule } from "../../prisma/prisma.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";
import {UserRpcService} from "./user_rpc.service";

@Module({
    providers: [UserResolver, UserRpcService],
    imports: [AuthModule, PrismaModule, RabbitMQModule],
    exports: [UserRpcService],
})
export class UserModule {}
