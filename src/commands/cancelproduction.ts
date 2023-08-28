import {Command} from "../types";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {sendRPC} from "../amqp";


export const cancelproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("cancelproduction")
        .setDescription("Cancels the production in the channel you ran this command in.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
            await interaction.reply({
                content: "Production not found! Please head to the channel of the production you want to edit",
                ephemeral: true
            })
            return;
        }
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("productionCancellation")
                    .setLabel("✅")
                    .setStyle(ButtonStyle.Success)
            )

        await interaction.reply({
            content: "Are you sure you want to cancel the production?",
            components: [row],
            ephemeral: true
        })
    }
}
