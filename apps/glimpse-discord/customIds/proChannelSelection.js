const { EmbedBuilder } = require('discord.js');
const { db } = require('../firebase');

module.exports = { 
    name: 'proChannelSelection',
    async execute(interaction) {
        const channelId = interaction.values[0];
        db.collection('rpi-tv').doc('setup').set({
            proChannel: channelId
        }, { merge: true });
        const setupDashboard = await interaction.guild.channels.cache.find((ch) => ch.id === interaction.message.reference.channelId)
            .messages.fetch(interaction.message.reference.messageId);
        const setupField = setupDashboard.embeds[0].data.fields
        setupField[0] = {
            name: '1️⃣ Productions Channel',
            value: `<#${channelId}>`
        }
        
        const newSetupDashboard = EmbedBuilder.from(setupDashboard.embeds[0]).setFields(setupField);
        await setupDashboard.edit({ embeds: [newSetupDashboard] });
        await interaction.reply({ content: 'Sucessfully set!', ephemeral: true })
    }
}