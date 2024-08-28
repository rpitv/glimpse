import {Command} from "../types";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {db} from "../db";
import {errorString} from "../util";

export const cancelproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("cancelproduction")
        .setDescription("Cancels the production in the channel you ran this command in.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            const currentProduction = await db.query.productions.findFirst({
                where: (production, {eq}) => eq(production.channelId, interaction.channelId),
            });

            if (!currentProduction) {
                await interaction.editReply({
                    content: "Production not found! Please head to the channel of the production you want to edit",
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

            await interaction.editReply({
                content: "Are you sure you want to cancel the production?",
                components: [row],
            });
        } catch (e) {
            interaction.editReply({
                content: errorString("Failed to cancel the production", e),
            });
        }
    }
}
