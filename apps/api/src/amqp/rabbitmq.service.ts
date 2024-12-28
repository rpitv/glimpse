import {Injectable, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ChannelWrapper, connect} from "amqp-connection-manager";

@Injectable()
export class RabbitMQService {

    private amqp = connect(this.configService.get<string>("RABBITMQ_URL"))
    private channel: ChannelWrapper;
    private readonly logger = new Logger('RabbitMQService');
    private rpcHandlers: Record<string, (args: unknown) => unknown | Promise<unknown>> = {}

    constructor(private readonly configService: ConfigService) {
    }

    /**
     * Create a new RabbitMQ consumer for the given RPC method.
     * A new consumer is created for each method because new method handlers could be added
     * after the channel connected. We need to re-consume queued messages.
     * @param method The RPC method name
     * @private
     */
    private async createRpcConsumer(method: string): Promise<void> {
        if(!this.rpcHandlers[method]) {
            throw new Error(`No method handler present for method ${method}`);
        }
        await this.awaitChannel();
        await this.channel.consume('rpc', async (msg) => {
            let data: any;
            try {
                data = JSON.parse(msg.content.toString());
            } catch(e) {
                this.logger.warn('Unable to parse received RPC message: invalid JSON')
            }
            if(typeof data !== "object" || data === null) {
                this.logger.warn('Unable to parse received RPC message: JSON is not an object')
                return;
            }
            if(data.method !== method) {
                this.channel.nack(msg)
                return;
            }
            const callback = this.rpcHandlers[method];
            if(!callback) {
                return;
            }

            const response: { error?: any, data?: any } = {}
            try {
                response.data = await callback(data.args);
            } catch(e) {
                response.error = e.message;
            }

            // FIXME type error with PublishOptions -- dependency conflict issues?
            await this.channel.sendToQueue(msg.properties.replyTo, response, {
                correlationId: msg.properties.correlationId
            } as any);
            this.channel.ack(msg);
        })
        this.logger.log(`Added consumer for RPC message ${method}`);
    }

    /**
     * Wait for {@link #channel} to be created and connected if it does not already exist
     * or is not currently connected.
     * @private
     */
    private async awaitChannel(): Promise<void> {
        if(this.channel) {
            return;
        }
        this.channel = this.amqp.createChannel({
            json: true,
            setup: async (channel) => {
                await channel.assertQueue('rpc', { durable: true })
            }
        });

        return new Promise((resolve, reject) => {
            const rpcSetupTimeout = setTimeout(() => {
                reject("RPC setup timed out (unable to connect to channel).")
            }, 30000)
            this.channel.waitForConnect().then(() => {
                clearTimeout(rpcSetupTimeout)
                resolve()
            }).catch(reject)

        })
    }

    public async addRpcHandler(rpcMethod: string, callback: (args: unknown) => unknown | Promise<unknown>): Promise<void> {
        if(this.rpcHandlers[rpcMethod]) {
            throw new Error(`RPC handler already registered for RPC method ${rpcMethod}.`);
        }
        this.rpcHandlers[rpcMethod] = callback;
        this.createRpcConsumer(rpcMethod).catch(e => {
            this.logger.error("Failed to listen for RPC messages RPC queue: " + e)
        })
    }
}
