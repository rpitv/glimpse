import {Command} from "../types";
import {ActionRowBuilder, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export const createproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("createproduction")
        .setDescription("Creates a production in the channel it was designated to that lists the details.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productionModal = new ModalBuilder()
            .setCustomId("productionCreator")
            .setTitle("Production Creator")

        const channelName = new TextInputBuilder()
            .setCustomId("productionChannelName")
            .setLabel("Name of the channel for the production")
            .setPlaceholder("Ex: \"2022 07 20 wsoccer carnegie\"")
            .setStyle(TextInputStyle.Short);
        const eventName = new TextInputBuilder()
            .setCustomId("eventName")
            .setLabel("Name of the event")
            .setPlaceholder("Ex: \"Women\"s Soccer vs. Carnegie Mellon\"")
            .setStyle(TextInputStyle.Short);
        const closetLocation = new TextInputBuilder()
            .setCustomId("closetLocation")
            .setLabel("Closet location")
            .setPlaceholder("Ex: \"ECAV\"")
            .setStyle(TextInputStyle.Short);
        const closetDate = new TextInputBuilder()
            .setCustomId("closetDate")
            .setLabel("Closet Date")
            .setPlaceholder("Ex: \"20220720\" (MUST BE FORMATTED LIKE THIS)")
            .setStyle(TextInputStyle.Paragraph);
        const closetStartEndTime = new TextInputBuilder()
            .setCustomId("times")
            .setLabel("Closet, start, and end times")
            .setPlaceholder("Ex: \"0430 PM 0700 PM 1030 PM\" (MUST BE FORMATTED LIKE THIS)")
            .setStyle(TextInputStyle.Paragraph);

        const channelRow = new ActionRowBuilder<TextInputBuilder>().addComponents(channelName);
        const eventRow = new ActionRowBuilder<TextInputBuilder>().addComponents(eventName);
        const locationRow = new ActionRowBuilder<TextInputBuilder>().addComponents(closetLocation);
        const dateRow = new ActionRowBuilder<TextInputBuilder>().addComponents(closetDate);
        const timeRow = new ActionRowBuilder<TextInputBuilder>().addComponents(closetStartEndTime);

        productionModal.addComponents(channelRow, eventRow, locationRow, dateRow, timeRow);

        await interaction.showModal(productionModal);
    }
}