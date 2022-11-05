const { EmbedBuilder } = require('discord.js');
const { db } = require('../../firebase');

module.exports = { 
    name: 'archiveSelection',
    async execute(interaction) {
        const categoryId = interaction.values[0];
        db.collection('rpi-tv').doc('setup').set({
            archive: categoryId
        }, { merge: true });
        const setupDashboard = await interaction.guild.channels.cache.get(interaction.message.reference.channelId)
            .messages.fetch(interaction.message.reference.messageId);
        const setupField = setupDashboard.embeds[0].data.fields

        const category = await interaction.guild.channels.cache.get(categoryId)
        setupField[2] = {
            name: '3️⃣ Archive',
            value: category.name
        }
        
        const newSetupDashboard = EmbedBuilder.from(setupDashboard.embeds[0]).setFields(setupField);
        await setupDashboard.edit({ embeds: [newSetupDashboard] });
        await interaction.reply({ content: 'Sucessfully set!', ephemeral: true })
    }
}