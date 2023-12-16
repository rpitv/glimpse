import {AmqpConnectionManager, Channel, ChannelWrapper, connect} from "amqp-connection-manager"
import {v4 as uuid} from "uuid";

let transientQueueName: string;
let globalConnection: AmqpConnectionManager
let globalChannel: ChannelWrapper;
let globalChannelIsConnected = false;

export function getConnection() {
    if(!globalConnection) {
        globalConnection = connect([process.env.RABBITMQ_URL as string]);
    }
    return globalConnection;
}

// Channels are, for whatever reason, not properly set up if you open them as soon as this file loads. Here we're
//  deferring the creation of channels until they're required. Additionally, we're waiting for the channel to be
//  connected before returning it, as the message queuing system was not working properly for me.
export async function getChannel() {
    const connection = getConnection();
    if(!globalChannel) {
        globalChannel = connection.createChannel({
            json: true,
            setup: (channel: Channel) => {
                console.log("Setting up AMQP channel");
                return Promise.all([
                    new Promise<void>((resolve, reject) => {
                        channel.assertQueue("", {exclusive: true}).then((result) => {
                            transientQueueName = result.queue;
                            resolve();
                        }).catch(reject);
                    }),
                    channel.assertQueue("rpc", { durable: true }),
                ]);
            }
        });
    }
    if(!globalChannelIsConnected) {
        await new Promise<void>(resolve => {
            globalChannel.once('connect', resolve);
            globalChannelIsConnected = true;
        });
    }

    return globalChannel;
}

export async function sendRPC<T = any>(method: string, params: Record<string, any>): Promise<T> {
    const correlationId = uuid();

    const channel = await getChannel();

    // Add a consumer to the channel that will resolve the promise when the response with the matching correlation ID
    //  is received. Consumer then removes itself.
    const responsePromise = new Promise<T>(async (resolve, reject) => {
        await channel.consume(transientQueueName, (msg) => {
            if(msg.properties.correlationId === correlationId) {
                try {
                    const response = JSON.parse(msg.content.toString());
                    if(response.error) {
                        reject(response.error);
                    } else {
                        const parsedResponse = JSON.parse(Buffer.from(response.data).toString());
                        if(parsedResponse.error) {
                            reject(parsedResponse.error);
                        } else {
                            resolve(parsedResponse.data);
                        }
                    }
                } catch(e) {
                    reject(e);
                } finally {
                    channel.cancel(correlationId);
                }
            }
        }, {
            consumerTag: correlationId,
        });
    });

    await channel.sendToQueue(
        "rpc",
        {method, params},
        {replyTo: transientQueueName, correlationId: correlationId}
    );

    return responsePromise;
}
