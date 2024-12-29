import {TypedEmitter} from "./TypedEmitter";
import {ApiResponse} from "./ApiResponse";
import {Production, User} from "./types";
import {GlimpseApiEvents, GlimpseApiInterface} from "./GlimpseApiInterface";
import {ChannelWrapper, connect} from 'amqp-connection-manager'
import { v4 } from "uuid"
import {Replies} from "amqplib";

export class GlimpseApi extends TypedEmitter<GlimpseApiEvents> implements GlimpseApiInterface {

    private amqp = connect(process.env.RABBITMQ_URL);
    private channel: ChannelWrapper;
    private responseQueue: Replies.AssertQueue;

    constructor() {
        super();
        this.awaitChannel();
    }

    /**
     * Wait for {@link #channel} and {@link #responseQueue} to be created and connected
     * if they do not already exist or are not currently connected.
     * @private
     */
    private async awaitChannel(): Promise<void> {
        if(this.channel) {
            return;
        }
        this.channel = this.amqp.createChannel({
            json: true,
            setup: async (channel: ChannelWrapper) => {
                await channel.assertQueue('rpc', { durable: true })
                this.responseQueue = await channel.assertQueue('', { exclusive: true })
                await this.setupEventListener(channel)
            }
        });
        await this.channel.waitForConnect();
    }

    private async setupEventListener(channel: ChannelWrapper): Promise<void> {
        await channel.assertExchange('discord-emitter', 'fanout', {
            durable: false
        });
        const eventResponseQueue = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(eventResponseQueue.queue, 'discord-emitter', '');
        await channel.consume(eventResponseQueue.queue, (msg) => {
            const data = JSON.parse(msg.content.toString());
            this.emit(data.event, data.data)
        }, { noAck: true })
    }

    /**
     * Send an RPC call to the Glimpse API
     * @param method Name of the RPC method to run
     * @param args Arguments for the RPC method
     * @returns {@link ApiResponse} with the data or error
     * @private
     */
    private async sendRPC<T>(method: string, args: Record<string, any>): Promise<ApiResponse<T>> {
        await this.awaitChannel();
        const correlationId = v4();

        const responsePromise = new Promise<string>(async resolve => {
            await this.channel.consume(this.responseQueue.queue, async msg => {
                if(msg.properties.correlationId !== correlationId) {
                    return
                }

                this.channel.ack(msg);
                await this.channel.cancel(correlationId);
                resolve(msg.content.toString())
            }, {
                consumerTag: correlationId,
            })
        })

        await this.channel.sendToQueue('rpc', {
            method, args
        }, {
            replyTo: this.responseQueue.queue,
            correlationId: correlationId,
        })

        return ApiResponse.fromJSON(await responsePromise);
    }

    public getUserFromUserId(userId: bigint): Promise<ApiResponse<User | null>> {
        return this.sendRPC<User | null>('getUserFromUserId', { userId: userId.toString() })
    }

    public getUserFromDiscordId(discordUserId: string): Promise<ApiResponse<User | null>> {
        return this.sendRPC<User | null>('getUserFromDiscordId', { discordUserId })
    }

    public registerUser(discordUserId: string, username: string, email: string): Promise<ApiResponse<User>> {
        return this.sendRPC<User>('registerUser', { discordUserId, username, email })
    }

    public updateUserVolunteerStatus(discordUserId: string, productionId: bigint, status: boolean, notes?: string | null): Promise<ApiResponse<void>> {
        return this.sendRPC<void>('updateUserVolunteerStatus', {
            discordUserId,
            productionId: productionId.toString(),
            status,
            notes
        })
    }

    public setProductionDiscordData(productionId: bigint, data: Record<string, any>): Promise<ApiResponse<void>> {
        return this.sendRPC<void>('setProductionDiscordData', {
            productionId: productionId.toString(),
            data
        })
    }

    public getLatestProductions(): Promise<ApiResponse<Production[]>> {
        return this.sendRPC<Production[]>('getLatestProductions', {})
    }

    public getProductionData(productionId: bigint): Promise<ApiResponse<Production | null>> {
        return this.sendRPC<Production | null>('getProductionData', { productionId: productionId.toString() })
    }
}
