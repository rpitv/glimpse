const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { db } = require('../firebase')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancelproduction')
        .setDescription('Cancels the production in the channel you ran this command in.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const productions = await db.collection('rpi-tv').doc('productions').get();
        const currentProduction  = productions.data().productions.find(production => production.channelId === interaction.channelId);

        if (!currentProduction) {
            interaction.reply({
                content: 'Production not found! Please head to the channel of the production you want to cancel',
                ephemeral: true
            });
            return;
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('productionCancellation')
                    .setLabel('✅')
                    .setStyle(ButtonStyle.Success),
            )

        await interaction.reply({
            content: 'Are you sure you want to cancel the production?',
            components: [row],
            ephemeral: true
        })
    }
}