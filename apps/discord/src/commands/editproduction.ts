import {Command} from "../types";
import {ActionRowBuilder, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {sendRPC} from "../amqp";
import moment from "moment";
import {dateFormat, ellipsis} from "../util";

export const editproduction: Command = {
    data: new SlashCommandBuilder()
        .setName("editproduction")
        .setDescription("Edits the production in the channel you ran this command in.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const productionModal = new ModalBuilder()
            .setCustomId("productionEditor")
            .setTitle("Production Editor")

        // Retrieve this channel's production by finding the first production that has this Discord channel and server IDs
        const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
                {
                    discordChannel: {equals: interaction.channelId },
                    discordServer: {equals: interaction.guildId }
                },
            pagination: { take: 1 }
        }))[0];

        if (!currentProduction) {
            await interaction.reply({
                content: "Production not found! Please head to the channel of the production you want to edit",
                ephemeral: true
            })
            return;
        }

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setRequired(true)
            .setLabel("Event name")
            .setPlaceholder(`Ex: "Women's Soccer vs. Carnegie Mellon"`)
            .setStyle(TextInputStyle.Short)
            .setValue(currentProduction.name)
        const description = new TextInputBuilder()
            .setCustomId("description")
            .setRequired(false)
            .setLabel("Event description")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(currentProduction.description)
        const location = new TextInputBuilder()
            .setCustomId("locations")
            .setLabel("Locations")
            .setRequired(false)
            .setPlaceholder(
                `Closet - Union\n` +
                `Event - ECAV`)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(
                `Closet - ${currentProduction.closetLocation}\n` +
                `Event - ${currentProduction.eventLocation}`)
        const schedule = new TextInputBuilder()
            .setCustomId("schedule")
            .setLabel("Schedule")
            .setRequired(false)
            .setPlaceholder(ellipsis(100,
                `Closet - ${moment().add(moment.duration(1, "hour")).minute(0).format(dateFormat)}\n` +
                `Start - ${moment().add(moment.duration(3, "hour")).minute(0).format(dateFormat)}\n` +
                `End - ${moment().add(moment.duration(5, "hour")).minute(0).format(dateFormat)}`
            ))
            .setStyle(TextInputStyle.Paragraph)
            .setValue(
                `Closet - ${moment(currentProduction.closetTime).format(dateFormat)}\n` +
                `Start - ${moment(currentProduction.startTime).format(dateFormat)}\n` +
                `End - ${moment(currentProduction.endTime).format(dateFormat)}`
            );
        const notes = new TextInputBuilder()
            .setCustomId("notes")
            .setLabel("Notes")
            .setRequired(false)
            .setPlaceholder("Ex: YouTube URL, external docs, ad placements")
            .setStyle(TextInputStyle.Paragraph)
            .setValue(currentProduction.teamNotes);

        const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
        const descriptionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(description);
        const locationRow = new ActionRowBuilder<TextInputBuilder>().addComponents(location);
        const scheduleRow = new ActionRowBuilder<TextInputBuilder>().addComponents(schedule);
        const notesRow = new ActionRowBuilder<TextInputBuilder>().addComponents(notes);

        productionModal.addComponents(nameRow, descriptionRow, locationRow, scheduleRow, notesRow);

        await interaction.showModal(productionModal);
    }
}
