import { Module } from "@nestjs/common";
import { RoleResolver } from "./role.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";

@Module({
    providers: [RoleResolver],
    imports: [PrismaModule, UserModule, RabbitMQModule],
})
export class RoleModule {}
