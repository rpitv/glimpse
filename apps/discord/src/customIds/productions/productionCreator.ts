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
    PermissionsBitField} from "discord.js";
import moment from "moment";
import {sendRPC} from "../../amqp";
import {dateFormat} from "../../util";


export const productionCreator: CustomId = {
    name: "productionCreator",
    async execute(interaction: ModalSubmitInteraction) {

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

        const production = new EmbedBuilder()
            .setColor("Red")
            .setTitle(name)
            .setDescription(description)
            .addFields(
                { name: "Closet", value: `${closetLocation} @ ${closetTime.format(dateFormat)}` },
                { name: "Start", value: `${eventLocation} @ ${startTime.format(dateFormat)}` },
                { name: "End", value: `${endTime.format(dateFormat)}` }
            )

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
            name: name,
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
        }).then(async (channel) => {
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
                await sendRPC<any>("createProduction", {data: {
                        name: name,
                        description: description,
                        discordServer: interaction.guildId,
                        discordChannel: channel.id,
                        discordVolunteerMessage: volunteerMsg.id,
                        discordUnvolunteerMessage: unVolunteerMsg.id,
                        eventLocation: eventLocation,
                        closetLocation: closetLocation,
                        closetTime: closetTime.valueOf(),
                        startTime: startTime.valueOf(),
                        endTime: endTime.valueOf(),
                        teamNotes: notes
                    }});
            } catch(e) {
                console.error(e);
                await interaction.reply({
                    content: "Failed to create production",
                    ephemeral: true
                });
                return;
            }

            await interaction.reply({ content: "Production successfully created!", ephemeral: true });
        })
    }
}
