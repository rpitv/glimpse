import { Resolvers } from "../generated/graphql";
import { connect } from "amqplib";

export const resolver: Resolvers = {
    Mutation: {
        createStream: async (
            parent,
            args
        ): Promise<boolean> => {
            const client = await connect(<string>process.env.RABBITMQ_URL);
            const channel = await client.createChannel();
            await channel.assertQueue("video:control:start", {
                durable: true,
            });
            channel.sendToQueue(
                "video:control:start",
                Buffer.from(
                    JSON.stringify({ from: args.input.from, to: args.input.to })
                )
            );
            await channel.close();
            await client.close();
            return true;
        },
    },
};
