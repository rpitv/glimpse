const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require('../firebase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editproduction')
        .setDescription('Edits the production in the channel you ran this command in.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productions = await db.collection('rpi-tv').doc('productions').get();
        const productionModal = new ModalBuilder()
            .setCustomId('productionEditor')
            .setTitle('Production Editor')
                
        const currentProduction = productions.data().productions.find(production => production.channelId === interaction.channelId);
        
        if (!currentProduction) {
            interaction.reply({
                content: 'Production not found! Please head to the channel of the production you want to edit',
                ephemeral: true
            })
            return;
        }

        const channelName = new TextInputBuilder()
            .setCustomId('productionChannelName')
            .setLabel('Name of the channel for the production')
            .setPlaceholder('Ex: "2022 07 20 wsoccer carnegie"')
            .setStyle(TextInputStyle.Short)
            .setValue(currentProduction.channelName)
        const eventName = new TextInputBuilder()
            .setCustomId('eventName')
            .setLabel('Name of the event')
            .setPlaceholder('Ex: "Women\'s Soccer vs. Carnegie Mellon"')
            .setStyle(TextInputStyle.Short)
            .setValue(currentProduction.eventName)
        const closetLocation = new TextInputBuilder()
            .setCustomId('closetLocation')
            .setLabel('Closet location')
            .setPlaceholder('Ex: "ECAV"')
            .setStyle(TextInputStyle.Short)
            .setValue(currentProduction.closetLocation);
        const closetDate = new TextInputBuilder()
            .setCustomId('closetDate')
            .setLabel('Closet Date')
            .setPlaceholder('Ex: "20220720" (MUST BE FORMATTED LIKE THIS)')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(currentProduction.inputValueClosetDate);
        const closetStartEndTime = new TextInputBuilder()
            .setCustomId('times')
            .setLabel('Closet, start, and end times')
            .setPlaceholder('Ex: "0430 PM 0700 PM 1030 PM" (MUST BE FORMATTED LIKE THIS)')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(currentProduction.inputValueTime);
        
        const channelRow = new ActionRowBuilder().addComponents(channelName);
        const eventRow = new ActionRowBuilder().addComponents(eventName);
        const locationRow = new ActionRowBuilder().addComponents(closetLocation);
        const dateRow = new ActionRowBuilder().addComponents(closetDate);
        const timeRow = new ActionRowBuilder().addComponents(closetStartEndTime);

        productionModal.addComponents(channelRow, eventRow, locationRow, dateRow, timeRow);

        await interaction.showModal(productionModal);
    }
}