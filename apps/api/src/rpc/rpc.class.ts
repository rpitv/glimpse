import { ChannelWrapper } from "amqp-connection-manager";
import { ConsumeMessage } from "amqplib";
import { RPCResponse } from "./rpc.registry";
export class RPC {
    private readonly method: string;
    private readonly params: Record<string, any>;
    private readonly message: ConsumeMessage;
    private readonly channel: ChannelWrapper;

    constructor(method: string, params: Record<string, any>, message: ConsumeMessage, channel: ChannelWrapper) {
        this.method = method;
        this.params = params;
        this.message = message;
        this.channel = channel;
    }

    public getMethod(): string {
        return this.method;
    }

    public getParams(): Record<string, any> {
        return this.params;
    }

    public async reply(data: RPCResponse, close = true): Promise<boolean> {
        const result = await this.channel.sendToQueue(
            this.message.properties.replyTo,
            Buffer.from(JSON.stringify(data)),
            { correlationId: this.message.properties.correlationId }
        );
        this.channel.ack(this.message);
        if (close) {
            await this.channel.close();
        }
        return result;
    }
}
