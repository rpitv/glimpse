import {CustomId} from "../../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    ChannelType,
    EmbedBuilder,
    GuildTextBasedChannel,
    ModalSubmitInteraction,
    PermissionsBitField,
    time
} from "discord.js";
import moment from "moment";
import {dateFormat, errorString, formatChannelName} from "../../util";
import { db } from "../../db";
import {productions} from "../../schema";

export const productionCreator: CustomId = {
    name: "productionCreator",
    async execute(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ ephemeral: true })
        const name = interaction.fields.getTextInputValue("name");
        const description = interaction.fields.getTextInputValue("description");
        const locations = interaction.fields.getTextInputValue("locations");
        const schedule = interaction.fields.getTextInputValue("schedule");

        const closetTime = moment(schedule.match(/Closet ?- ?(.*)/)?.[1], dateFormat);
        const startTime = moment(schedule.match(/Start ?- ?(.*)/)?.[1], dateFormat);
        const endTime = moment(schedule.match(/End ?- ?(.*)/)?.[1], dateFormat);

        const closetLocation = locations.match(/Closet ?- ?(.*)/)?.[1];
        const eventLocation = locations.match(/Event ?- ?(.*)/)?.[1];

        const production = new EmbedBuilder()
            .setColor("Red")
            .setTitle(name)
            .addFields(
                { name: "Closet", value: `${closetLocation} @ ${time(new Date(closetTime.format()))}`},
                { name: "Start", value: `${eventLocation} @ ${time(new Date(startTime.format()))}`},
                { name: "End", value: `${time(new Date(endTime.format()))}`}
            )
        if (description.trim().length > 0)
            production.setDescription(description);

        const volunteerBtn = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("volunteer")
                    .setLabel("Volunteer")
                    .setStyle(ButtonStyle.Success)
            )

        const unVolunteerBtn = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("unvolunteer")
                    .setLabel("Unvolunteer")
                    .setStyle(ButtonStyle.Danger)
            )
        await interaction.guild?.channels.create({
            name: formatChannelName(name, startTime),
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: process.env.RPITV_ID,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ],
            parent: process.env.PRODUCTIONS_CATEGORY_ID as string
        }).then(async (channel: GuildTextBasedChannel) => {
            production.addFields(
                { name: "Channel", value: `${channelMention(channel.id)}`},
                { name: "Volunteers", value: "(0) 🦗"})
            const volChl = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
            const volunteerMsg = await volChl.send({
                embeds: [production],
                components: [volunteerBtn]
            });

            const unVolunteerMsg = await channel.send({
                embeds: [production],
                components: [unVolunteerBtn]
            }).then(async (msg) => await msg.pin());

            try {
                await db.insert(productions).values({
                    channelId: channel.id,
                    channelName: name,
                    description: description,
                    closetLocation: closetLocation,
                    eventLocation: eventLocation,
                    closetTime: new Date(closetTime.format()),
                    startTime: new Date(startTime.format()),
                    endTime: new Date(endTime.format()),
                    volunteerEmbedId: volunteerMsg.id,
                    unVolunteerEmbedId: unVolunteerMsg.id,
                });
                // await sendRPC<any>("createProduction", {data: {
                //         name: name,
                //         description: description,
                //         discordServer: interaction.guildId,
                //         discordChannel: channel.id,
                //         discordVolunteerMessage: volunteerMsg.id,
                //         discordUnvolunteerMessage: unVolunteerMsg.id,
                //         eventLocation: eventLocation,
                //         closetLocation: closetLocation,
                //         closetTime: closetTime.valueOf(),
                //         startTime: startTime.valueOf(),
                //         endTime: endTime.valueOf(),
                //         teamNotes: notes
                //     }});
            } catch(e) {
                console.error(e);
                await interaction.editReply({
                    content: errorString("Failed to create production", e),
                });
                return;
            }

            await interaction.editReply({ content: "Production successfully created!" });
        }).catch(async (e) => {
            await interaction.editReply({
                content: errorString("Failed to create production", e),
            })
        })
    }
}
