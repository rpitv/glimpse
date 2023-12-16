import {Command} from "../types";
import {ActionRowBuilder, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import moment from "moment/moment";
import {dateFormat, ellipsis} from "../util";

export const createproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("createproduction")
        .setDescription("Creates a production in the channel it was designated to that lists the details.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productionModal = new ModalBuilder()
            .setCustomId("productionCreator")
            .setTitle("Production Creator")

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setRequired(true)
            .setLabel("Event name")
            .setPlaceholder(`Ex: "Women's Soccer vs. Carnegie Mellon"`)
            .setStyle(TextInputStyle.Short)
        const description = new TextInputBuilder()
            .setCustomId("description")
            .setRequired(false)
            .setLabel("Event description")
            .setStyle(TextInputStyle.Paragraph)
        const location = new TextInputBuilder()
            .setCustomId("locations")
            .setLabel("Locations")
            .setRequired(false)
            .setPlaceholder(
                `Closet - Union\n` +
                `Event - ECAV`)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(
                `Closet - Union\n` +
                `Event - ECAV`)
        const schedule = new TextInputBuilder()
            .setCustomId("schedule")
            .setLabel("Schedule")
            .setRequired(false)
            .setPlaceholder(ellipsis(100,
                `Closet - ${moment().add(moment.duration(1, "hour")).minute(0).format(dateFormat)}\n` +
                `Start - ${moment().add(moment.duration(3, "hour")).minute(0).format(dateFormat)}\n` +
                `End - ${moment().add(moment.duration(5, "hour")).minute(0).format(dateFormat)}`)
            )
            .setStyle(TextInputStyle.Paragraph)
            .setValue(
                `Closet - ${moment().add(moment.duration(1, "hour")).minute(0).format(dateFormat)}\n` +
                `Start - ${moment().add(moment.duration(3, "hour")).minute(0).format(dateFormat)}\n` +
                `End - ${moment().add(moment.duration(5, "hour")).minute(0).format(dateFormat)}`);
        const notes = new TextInputBuilder()
            .setCustomId("notes")
            .setLabel("Notes")
            .setRequired(false)
            .setPlaceholder("Ex: YouTube URL, external docs, ad placements")
            .setStyle(TextInputStyle.Paragraph);

        const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
        const descriptionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(description);
        const locationRow = new ActionRowBuilder<TextInputBuilder>().addComponents(location);
        const scheduleRow = new ActionRowBuilder<TextInputBuilder>().addComponents(schedule);
        const notesRow = new ActionRowBuilder<TextInputBuilder>().addComponents(notes);

        productionModal.addComponents(nameRow, descriptionRow, locationRow, scheduleRow, notesRow);

        await interaction.showModal(productionModal);
    }
}
