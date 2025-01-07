import {forwardRef, Module} from "@nestjs/common";
import { ProductionRSVPResolver } from "./production_rsvp.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {ProductionRSVPRpcService} from "./production_rsvp_rpc.service";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";
import {ProductionModule} from "../production/production.module";

@Module({
    providers: [ProductionRSVPResolver, ProductionRSVPRpcService],
    imports: [PrismaModule, RabbitMQModule, forwardRef(() => ProductionModule)],
    exports: [ProductionRSVPRpcService],
})
export class ProductionRSVPModule {}
