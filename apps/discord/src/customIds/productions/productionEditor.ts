import {CustomId} from "../../types";
import {
    channelMention,
    EmbedBuilder,
    GuildTextBasedChannel,
    ModalSubmitInteraction,
    time
} from "discord.js";
import moment from "moment";
import {dateFormat, errorString, formatChannelName} from "../../util";
import { db } from "../../db";
import {productions} from "../../schema";
import { eq } from 'drizzle-orm';

export const productionEditor: CustomId = {
    name: "productionEditor",
    async execute(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ ephemeral: true });
        // Retrieve this channel's production by finding the first production that has this Discord channel and server IDs
        // const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
        //         {
        //             discordChannel: {equals: interaction.channelId },
        //             discordServer: {equals: interaction.guildId }
        //         },
        //     pagination: { take: 1 }
        // }))[0];
        try {
            const currentProduction = await db.query.productions.findFirst({
                where: (production, {eq}) => eq(production.channelId, interaction.channelId),
            });
            const currentVolunteers = await db.query.volunteers.findMany({
                where: (volunteer, {eq}) => eq(volunteer.channelId, interaction.channelId),
            });
            if (!currentProduction) {
                await interaction.editReply({
                    content: "Production not found! Please head to the channel of the production you want to edit",
                })
                return;
            }

            const name = interaction.fields.getTextInputValue("name");
            const description = interaction.fields.getTextInputValue("description");
            const locations = interaction.fields.getTextInputValue("locations");
            const schedule = interaction.fields.getTextInputValue("schedule");

            const closetTime = moment(schedule.match(/Closet ?- ?(.*)/)?.[1], dateFormat);
            const startTime = moment(schedule.match(/Start ?- ?(.*)/)?.[1], dateFormat);
            const endTime = moment(schedule.match(/End ?- ?(.*)/)?.[1], dateFormat);

            const closetLocation = locations.match(/Closet ?- ?(.*)/)?.[1];
            const eventLocation = locations.match(/Event ?- ?(.*)/)?.[1];

            await db.update(productions).set({
                channelName: name,
                description: description,
                closetLocation: closetLocation,
                eventLocation: eventLocation,
                closetTime: new Date(closetTime.format()),
                startTime: new Date(startTime.format()),
                endTime: new Date(endTime.format()),
            }).where(eq(productions.channelId, currentProduction.channelId));
            // await sendRPC<any>("updateProduction", {id: currentProduction.id, data: {
            //         name: name,
            //         description: description,
            //         eventLocation: eventLocation,
            //         closetLocation: closetLocation,
            //         closetTime: closetTime.toDate(),
            //         startTime: startTime.toDate(),
            //         endTime: endTime.toDate(),
            //         teamNotes: notes
            //     }});

            let volunteerString = `(${currentVolunteers.length}) `
            for (const volunteer of currentVolunteers)
                volunteerString += `<@${volunteer.userId}> `;


            const production = new EmbedBuilder()
                .setColor("Red")
                .setTitle(name)
                .addFields(
                  { name: "Closet", value: `${closetLocation} @ ${time(new Date(closetTime.format()))}`},
                  { name: "Start", value: `${eventLocation} @ ${time(new Date(startTime.format()))}`},
                  { name: "End", value: `${time(new Date(endTime.format()))}`},
                  { name: "Channel", value: `${channelMention(interaction.channelId)}`}
                );

            if (description.length)
                production.setDescription(description);

            if (currentVolunteers.length === 0)
                production.addFields({ name: "Volunteers", value: "(0) 🦗"})
            else
                production.addFields({ name: "Volunteers", value: `${volunteerString}`});

            const volChl = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
            const volunteerMsg = await volChl.messages.fetch(currentProduction.volunteerEmbedId);

            const unVolChl = await interaction.guild?.channels.fetch(currentProduction.channelId) as GuildTextBasedChannel;
            const unVolunteerMsg = await unVolChl.messages.fetch(currentProduction.unVolunteerEmbedId);

            await interaction.channel.setName(formatChannelName(name, startTime));

            volunteerMsg.edit({ embeds: [production] });
            unVolunteerMsg.edit({ embeds: [production] });

            await interaction.editReply({
                content: "Successfully edited",
            });
        } catch(e) {
            await interaction.editReply({
                content: errorString("Failed to edit production", e),
            });
            return;
        }
    }
}
