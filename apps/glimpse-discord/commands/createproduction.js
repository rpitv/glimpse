const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createproduction')
        .setDescription('Creates a production embed in the channel it was designated to that lists the details.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productionModal = new ModalBuilder()
            .setCustomId('productionCreation')
            .setTitle('Production Creator')
        
        const channelName = new TextInputBuilder()
            .setCustomId('productionChannelName')
            .setLabel('Name of the channel for the production')
            .setPlaceholder('Ex: "2022 07 20 wsoccer carnegie"')
            .setStyle(TextInputStyle.Short);
        const eventName = new TextInputBuilder()
            .setCustomId('eventName')
            .setLabel('Name of the event')
            .setPlaceholder('Ex: "Women\'s Soccer vs. Carnegie Mellon"')
            .setStyle(TextInputStyle.Short);
        const closetLocation = new TextInputBuilder()
            .setCustomId('closetLocation')
            .setLabel('Closet location')
            .setPlaceholder('Ex: "ECAV"')
            .setStyle(TextInputStyle.Short);
        const closetTime = new TextInputBuilder()
            .setCustomId('closetTime')
            .setLabel('Closet time')
            .setPlaceholder('Ex: "0430 PM Thursday July 20" (MUST BE FORMATTED LIKE THIS)')
            .setStyle(TextInputStyle.Short);
        const startEndTime = new TextInputBuilder()
            .setCustomId('startEndTime')
            .setLabel('Start and end times')
            .setPlaceholder('Ex: "0700 PM 1030 PM" (MUST BE FORMATTED LIKE THIS)')
            .setStyle(TextInputStyle.Short);
        
        const channelRow = new ActionRowBuilder().addComponents(channelName);
        const eventRow = new ActionRowBuilder().addComponents(eventName);
        const locationRow = new ActionRowBuilder().addComponents(closetLocation);
        const closetTimeRow = new ActionRowBuilder().addComponents(closetTime);
        const startEndRow = new ActionRowBuilder().addComponents(startEndTime);

        productionModal.addComponents(channelRow, eventRow, locationRow, closetTimeRow, startEndRow);
        
        await interaction.showModal(productionModal);
    }
};