import { Module } from "@nestjs/common";
import { PersonRoleResolver } from "./person_role.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";

@Module({
    providers: [PersonRoleResolver],
    imports: [PrismaModule, UserModule, RabbitMQModule],
})
export class PersonRoleModule {}
