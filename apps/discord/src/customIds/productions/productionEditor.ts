import {CustomId} from "../../types";
import {
    channelMention,
    EmbedBuilder,
    GuildTextBasedChannel,
    ModalSubmitInteraction
} from "discord.js";
import moment from "moment";
import {sendRPC} from "../../amqp";
import {dateFormat, formatChannelName} from "../../util";


export const productionEditor: CustomId = {
    name: "productionEditor",
    async execute(interaction: ModalSubmitInteraction) {
        const currentProCh = await interaction.channel as GuildTextBasedChannel;
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

        const name = interaction.fields.getTextInputValue("name");
        const description = interaction.fields.getTextInputValue("description");
        const locations = interaction.fields.getTextInputValue("locations");
        const schedule = interaction.fields.getTextInputValue("schedule");
        const notes = interaction.fields.getTextInputValue("notes");

        const closetTime = moment(schedule.match(/Closet ?- ?(.*)/)?.[1], dateFormat);
        const startTime = moment(schedule.match(/Start ?- ?(.*)/)?.[1], dateFormat);
        const endTime = moment(schedule.match(/End ?- ?(.*)/)?.[1], dateFormat);

        const closetLocation = locations.match(/Closet ?- ?(.*)/)?.[1];
        const eventLocation = locations.match(/Event ?- ?(.*)/)?.[1];

        try {
            await sendRPC<any>("updateProduction", {id: currentProduction.id, data: {
                    name: name,
                    description: description,
                    eventLocation: eventLocation,
                    closetLocation: closetLocation,
                    closetTime: closetTime.toDate(),
                    startTime: startTime.toDate(),
                    endTime: endTime.toDate(),
                    teamNotes: notes
                }});
        } catch(e) {
            console.error(e);
            await interaction.reply({
                content: "Failed to edit production",
                ephemeral: true
            });
            return;
        }

        let volunteers = `(${currentProduction.volunteers.length}) `
        for (const volunteer of currentProduction.volunteers) {
            volunteers += `<@${volunteer}> `;
        }

        const production = new EmbedBuilder()
            .setColor("Red")
            .setTitle(name)
            .setDescription(description)
            .addFields(
                { name: "Closet", value: `${locations} @ ${closetTime.format(dateFormat)}` },
                { name: "Start", value: `${eventLocation} @ ${startTime.format(dateFormat)}` },
                { name: "End", value: `${endTime.format(dateFormat)}` },
                { name: "Channel", value: `${channelMention(currentProCh.id)}`}
            );
        if (volunteers.length === 0 )
            production.addFields({ name: "Volunteers", value: "(0) 🦗"})
        else
            production.addFields({ name: "Volunteers", value: `${volunteers}`});

        const volChl = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
        const volunteerMsg = await volChl.messages.fetch(currentProduction.discordVolunteerMessage);

        const unVolChl = await interaction.guild?.channels.fetch(currentProduction.discordChannel) as GuildTextBasedChannel;
        const unVolunteerMsg = await unVolChl.messages.fetch(currentProduction.discordUnvolunteerMessage);

        await currentProCh.setName(formatChannelName(name, startTime));

        volunteerMsg.edit({ embeds: [production] });
        unVolunteerMsg.edit({ embeds: [production] });

        await interaction.reply({
            content: "Successfully edited",
            ephemeral: true
        });
    }
}
