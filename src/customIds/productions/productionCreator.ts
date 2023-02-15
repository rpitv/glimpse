import {CustomId, Setup} from "../../types";
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    channelMention, ChannelType, EmbedBuilder, GuildTextBasedChannel, ModalSubmitInteraction, PermissionsBitField
} from "discord.js";
import {db} from "../../firebase";
import moment from "moment";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;


export const productionCreator: CustomId = {
    name: "productionCreator",
    async execute(interaction: ModalSubmitInteraction) {
        const setupRef = db.collection("rpi-tv").doc("setup");
        const setupData = await setupRef.get();
        const { proCategory, proChannel } = setupData.data() as Setup;
        const productionsRef = db.collection("rpi-tv").doc("productions");

        const channelName = interaction.fields.getTextInputValue("productionChannelName");
        const eventName = interaction.fields.getTextInputValue("eventName");
        const closetLocation = interaction.fields.getTextInputValue("closetLocation");
        const closetDate = interaction.fields.getTextInputValue("closetDate")
        const closetStartEndTime = interaction.fields.getTextInputValue("times").split(" ");

        const date = moment(closetDate, "YYYYMMDD").format("dddd MMMM DD YYYY");
        const closetTime = moment(closetStartEndTime[0], "HHmm").format("HH:mm") + ` ${closetStartEndTime[1]}`;
        const startTime = moment(closetStartEndTime[2], "HHmm").format("HH:mm") + ` ${closetStartEndTime[3]}`;
        const endTime = moment(closetStartEndTime[4], "HHmm").format("HH:mm") + ` ${closetStartEndTime[5]}`;

        const production = new EmbedBuilder()
            .setColor("Red")
            .setTitle(eventName)
            .setDescription(date)
            .addFields(
                { name: "Closet", value: `${closetLocation} @ ${closetTime}` },
                { name: "Start", value: `${startTime}` },
                { name: "End", value: `${endTime}` },
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
            name: channelName,
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
            parent: proCategory
        }).then(async (channel) => {
            production.addFields(
                { name: "Channel", value: `${channelMention(channel.id)}`},
                { name: "Volunteers", value: "(0) 🦗"})
            const volChl = await interaction.guild?.channels.cache.get(proChannel) as GuildTextBasedChannel;
            const volunteerMsg = await volChl.send({
                embeds: [production],
                components: [volunteerBtn]
            });

            const unVolunteerMsg = await channel.send({
                embeds: [production],
                components: [unVolunteerBtn]
            }).then(async (msg) => await msg.pin());

            if (!await productionsRef.get().then((snapshot) => snapshot.data()))
                await productionsRef.set({ productions: [{
                        channelName: channelName,
                        eventName: eventName,
                        channelId: channel.id,
                        volunteerMsgId: volunteerMsg.id,
                        unVolunteerMsgId: unVolunteerMsg.id,
                        closetLocation: closetLocation,
                        closetTime: closetTime,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        volunteers: [],
                        inputValueClosetDate: interaction.fields.getTextInputValue("closetDate"),
                        inputValueTime: interaction.fields.getTextInputValue("times")
                    }]});
            else
                await productionsRef.update({ productions: FieldValue.arrayUnion({
                        channelName: channelName,
                        eventName: eventName,
                        channelId: channel.id,
                        volunteerMsgId: volunteerMsg.id,
                        unVolunteerMsgId: unVolunteerMsg.id,
                        closetLocation: closetLocation,
                        closetTime: closetTime,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        volunteers: [],
                        inputValueClosetDate: interaction.fields.getTextInputValue("closetDate"),
                        inputValueTime: interaction.fields.getTextInputValue("times")
                    })});

            await interaction.reply({ content: "Production successfully created!", ephemeral: true });
        })
    }
}