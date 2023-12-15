import { Injectable } from "@nestjs/common";
import { Channel, ChannelWrapper, connect } from "amqp-connection-manager";
import { ConfigService } from "@nestjs/config";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/types/AmqpConnectionManager";
import { AMQPQueues } from "./queues.enum";

@Injectable()
export class AMQPService {
    private connection: IAmqpConnectionManager;

    constructor(private readonly config: ConfigService) {
        this.connection = connect([this.config.get<string>("RABBITMQ_URL")]);
    }

    public createChannel(): ChannelWrapper {
        return this.connection.createChannel({
            json: true,
            setup: (channel: Channel) => {
                return Promise.all([
                    channel.assertQueue(AMQPQueues.TRANSIENT, { exclusive: true }),
                    channel.assertExchange(AMQPQueues.VIDEO_STATE, "fanout", { durable: true }),
                    channel.assertQueue(AMQPQueues.RPC, { durable: true }),
                    channel.assertQueue(AMQPQueues.VIDEO_CONTROL_START, { durable: true })
                ]);
            }
        });
    }

    public isConnected(): boolean {
        return this.connection.isConnected();
    }

    public async close(): Promise<void> {
        await this.connection.close();
    }
}
