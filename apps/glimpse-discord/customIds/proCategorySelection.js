const { EmbedBuilder } = require('discord.js');
const { db } = require('../firebase');

module.exports = { 
    name: 'proCategorySelection',
    async execute(interaction) {
        const categoryId = interaction.values[0];
        db.collection('rpi-tv').doc('setup').set({
            proCategory: categoryId
        }, { merge: true });
        const setupDashboard = await interaction.guild.channels.cache.find((ch) => ch.id === interaction.message.reference.channelId)
            .messages.fetch(interaction.message.reference.messageId);
        const setupField = setupDashboard.embeds[0].data.fields

        const category = await interaction.guild.channels.cache.find((cat) => cat.id === categoryId)
        setupField[1] = {
            name: '2️⃣ Productions Category',
            value: category.name
        }
        
        const newSetupDashboard = EmbedBuilder.from(setupDashboard.embeds[0]).setFields(setupField);
        await setupDashboard.edit({ embeds: [newSetupDashboard] });
        await interaction.reply({ content: 'Sucessfully set!', ephemeral: true })
    }
}