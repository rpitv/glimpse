import { Resolvers, Stream } from "../generated/graphql";
import {connect, ConsumeMessage, Connection} from "amqplib";

const streams: { [key: string]: Stream } = {};
const streamLastSeen: { [key: string]: number } = {};

async function connectRetry(url: string, retries: number): Promise<Connection> {
    let client;
    for (let i = 0; i < retries; i++) {
        try {
            client = await connect(url);
            break;
        } catch (err) {
            console.log("Error connecting to RabbitMQ, retrying in 5 seconds");
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
    if (!client) {
        throw new Error("Could not connect to RabbitMQ");
    }
    return client;
}

connectRetry(<string>process.env.RABBITMQ_URL, 10).then(async (client) => {
    const channel = await client.createChannel();
    // Create exclusive queue to be bound to the state exchange
    const queue = await channel.assertQueue("", { exclusive: true });
    await channel.assertExchange("video:state", "fanout", { durable: true });
    await channel.bindQueue(queue.queue, "video:state", "");

    await channel.consume(queue.queue, async (rmqMessage: ConsumeMessage|null) => {
        if (!rmqMessage) {
            return; // TODO throw error
        }

        const message = JSON.parse(rmqMessage.content.toString());

        if (message.id) {
            streams[message.id] = message;
            streamLastSeen[message.id] = Date.now();
        }
    });
});

// Periodically clear dead streams from list of streams
setInterval(() => {
    for (const key in streams) {
        if (!streamLastSeen[key] || Date.now() - streamLastSeen[key] > 10000) {
            delete streams[key];
            delete streamLastSeen[key];
        }
    }
}, 1000);

export const resolver: Resolvers = {
    Query: {
        streams: async (): Promise<Stream[]> => {
            console.log("reading streams", streams);
            const streamArray: Stream[] = [];
            for (const key in streams) {
                streamArray.push(streams[key]);
            }
            return streamArray;
        },
    },
};
