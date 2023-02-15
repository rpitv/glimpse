import {CustomId} from "../../types";
import {BaseGuildTextChannel, EmbedBuilder, SelectMenuInteraction} from "discord.js";
import {db} from "../../firebase";


export const proChannelSelection: CustomId = {
    name: "proChannelSelection",
    async execute(interaction: SelectMenuInteraction) {
        const channelId = interaction.values[0];
        await db.collection('rpi-tv').doc('setup').set({
            proChannel: channelId
        }, { merge: true });

        const setup = await interaction.guild?.channels.fetch(interaction.message.reference?.channelId as string) as BaseGuildTextChannel;
        const setupDashboard = await setup?.messages.fetch(interaction.message.reference?.messageId as string);
        const setupField = setupDashboard.embeds[0].fields;

        setupField[0] = {
            name: '1️⃣ Productions Channel',
            value: `<#${channelId}>`
        }

        const newSetupDashboard = EmbedBuilder.from(setupDashboard.embeds[0]).setFields(setupField);
        await setupDashboard.edit({ embeds: [newSetupDashboard] });
        await interaction.reply({ content: 'Sucessfully set!', ephemeral: true })
    }
}