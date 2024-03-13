const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, time } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cece')
        .setDescription('Creates a production that lists the details which takes in the Cece format.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productionModal = new ModalBuilder()
            .setCustomId('ceceproductionCreator')
            .setTitle('CECE Production Creator')

        const channelName = new TextInputBuilder()
            .setCustomId('ceceproductionChannelName')
            .setLabel('Name of the channel for the production')
            .setPlaceholder('Ex: "2022 07 20 wsoccer carnegie"')
            .setStyle(TextInputStyle.Short);
        const event = new TextInputBuilder()
            .setCustomId('event')
            .setLabel('The event details')
            .setPlaceholder(`MEN
Date: Saturday February 24th 2024
Closet @ HFH: 11:00 AM
Start: 1:00 PM
End: 3:00 PM`).setStyle(TextInputStyle.Paragraph);

        const channelRow = new ActionRowBuilder().addComponents(channelName);
        const eventRow = new ActionRowBuilder().addComponents(event);

        productionModal.addComponents(channelRow, eventRow);

        await interaction.showModal(productionModal);
    }
};
