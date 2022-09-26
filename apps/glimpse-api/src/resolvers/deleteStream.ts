import { Resolvers } from "../generated/graphql";
import { connect } from "amqplib";

export const resolver: Resolvers = {
    Mutation: {
        deleteStream: async (
            parent,
            args
        ): Promise<boolean> => {
            const client = await connect(<string>process.env.RABBITMQ_URL);
            const channel = await client.createChannel();

            // Intentionally don't assert queue here, because we don't want to create it if it doesn't exist
            channel.sendToQueue(
                "video:control:" + args.id,
                Buffer.from("stop")
            );
            await channel.close();
            await client.close();
            return true;
        },
    },
};
