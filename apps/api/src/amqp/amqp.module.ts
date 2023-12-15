import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AMQPService } from "./amqp.service";
import { RPCModule } from "../rpc/rpc.module";

@Module({
    imports: [ConfigModule, forwardRef(() => RPCModule)],
    providers: [AMQPService],
    exports: [AMQPService]
})
export class AMQPModule {}
