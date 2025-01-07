import {forwardRef, Module} from "@nestjs/common";
import { ProductionResolver } from "./production.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import {ProductionRpcService} from "./production_rpc.service";
import {ProductionRSVPModule} from "../production_rsvp/production_rsvp.module";
import {RabbitMQModule} from "../../amqp/rabbitmq.module";

@Module({
    providers: [ProductionResolver, ProductionRpcService],
    imports: [PrismaModule, forwardRef(() => ProductionRSVPModule), RabbitMQModule],
    exports: [ProductionRpcService]
})
export class ProductionModule {}
