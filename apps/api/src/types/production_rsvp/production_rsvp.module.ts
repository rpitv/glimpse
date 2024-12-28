import { Module } from "@nestjs/common";
import { ProductionRSVPResolver } from "./production_rsvp.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {ProductionRSVPRpcService} from "./production_rsvp_rpc.service";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";

@Module({
    providers: [ProductionRSVPResolver, ProductionRSVPRpcService],
    imports: [PrismaModule, RabbitMQModule],
    exports: [ProductionRSVPRpcService],
})
export class ProductionRSVPModule {}
