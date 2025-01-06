import {CustomId} from "../../types";
import {GuildTextBasedChannel} from "discord.js";
import { db } from "../../db";
import { eq } from 'drizzle-orm';
import {productions, volunteers} from "../../schema";
import {errorString} from "../../util";

export const productionCancellation: CustomId = {
    name: "productionCancellation",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        // Retrieve this channel's production by finding the first production that has this Discord channel and server IDs
        // const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
        //         {
        //             discordChannel: {equals: interaction.channelId },
        //             discordServer: {equals: interaction.guildId }
        //         },
        //     pagination: { take: 1 }
        // }))[0];
        try {
            const currentProduction = await db.query.productions.findFirst({
                where: (production, {eq}) => eq(production.channelId, interaction.channelId),
            });
            if (!currentProduction) {
                interaction.editReply({
                    content: "Production not found! Please head to the channel of the production you want to edit",
                });
                return;
            }

            await db.delete(volunteers).where(eq(volunteers.channelId, currentProduction.channelId));
            await db.delete(productions).where(eq(productions.channelId, currentProduction.channelId));
            // await sendRPC<any>("deleteProduction", {id: currentProduction.id});

            const productionChannel = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
            productionChannel.messages.fetch(currentProduction.volunteerEmbedId).then(msg => msg.delete());

            const currentProductionChannel = await interaction.guild?.channels.fetch(currentProduction.channelId) as GuildTextBasedChannel;
            await currentProductionChannel.delete();
        } catch (e) {
            await interaction.editReply({
                content: errorString("Failed to delete production", e),
            });
            return;
        }
    }
}
