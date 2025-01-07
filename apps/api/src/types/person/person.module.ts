import { Module } from "@nestjs/common";
import { PersonResolver } from "./person.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";

@Module({
    providers: [PersonResolver],
    imports: [PrismaModule, UserModule, RabbitMQModule]
})
export class PersonModule {}
