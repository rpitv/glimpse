import { Resolvers, Stream } from "../generated/graphql";
import { connect } from "amqplib";

const streams: { [key: string]: Stream } = {};
const streamLastSeen: { [key: string]: number } = {};

connect(<string>process.env.RABBITMQ_URL).then(async (client) => {
    const channel = await client.createChannel();
    // Create exclusive queue to be bound to the state exchange
    const queue = await channel.assertQueue("", { exclusive: true });
    await channel.assertExchange("video:state", "fanout", { durable: true });
    await channel.bindQueue(queue.queue, "video:state", "");

    await channel.consume(queue.queue, async (rmqMessage) => {
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
