import {Command, Productions} from "../types";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {db} from "../firebase";


export const cancelproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("cancelproduction")
        .setDescription("Cancels the production in the channel you ran this command in.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await db.collection("rpi-tv").doc("productions").get().then(async (snapshot) => {
            const { productions } = snapshot.data() as Productions;
            const currentProduction = productions.find(production => production.channelId === interaction.channelId);

            if (!currentProduction) {
                await interaction.reply({
                    content: "Production not found! Please head to the channel of the production you want to cancel",
                    ephemeral: true
                });
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
        });
    }
}