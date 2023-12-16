import {CustomId} from "../../types";
import {GuildTextBasedChannel} from "discord.js";
import {sendRPC} from "../../amqp";


export const productionCancellation: CustomId = {
    name: "productionCancellation",
    async execute(interaction) {
        // Retrieve this channel's production by finding the first production that has this Discord channel and server IDs
        const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
                {
                    discordChannel: {equals: interaction.channelId },
                    discordServer: {equals: interaction.guildId }
                },
            pagination: { take: 1 }
        }))[0];

        if (!currentProduction) {
            interaction.reply({
                content: "Production not found! Please head to the channel of the production you want to edit",
                ephemeral: true
            })
            return;
        }

        try {
            await sendRPC<any>("deleteProduction", {id: currentProduction.id});
        } catch(e) {
            console.error(e);
            await interaction.reply({
                content: "Failed to delete production",
                ephemeral: true
            });
            return;
        }

        const productionChannel = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
        productionChannel.messages.fetch(currentProduction.discordVolunteerMessage).then(msg => msg.delete());

        const currentProductionChannel = await interaction.guild?.channels.fetch(currentProduction.discordChannel) as GuildTextBasedChannel;
        await currentProductionChannel.delete();
    }
}
