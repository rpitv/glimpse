import {CustomId, Production, Setup} from "../../types";
import {
    BaseGuildTextChannel,
    channelMention,
    EmbedBuilder,
    GuildTextBasedChannel,
    ModalSubmitInteraction
} from "discord.js";
import { db } from "../../firebase";
import moment from "moment";
import { FieldValue } from "firebase-admin/firestore";


export const productionEditor: CustomId = {
    name: "productionEditor",
    async execute(interaction: ModalSubmitInteraction) {
        const setupRef = db.collection("rpi-tv").doc("setup");
        const setupData = await setupRef.get();
        const { proChannel } = setupData.data() as Setup;
        const productionsRef = db.collection("rpi-tv").doc("productions");
        const productionsData = await productionsRef.get();
        const currentProCh = await interaction.channel as GuildTextBasedChannel;
        let currentProduction = productionsData.data()?.productions.find((production: Production) => production.channelId === interaction.channelId);

        if (!currentProduction) {
            await interaction.reply({
                content: "Production not found! Please head to the channel of the production you want to edit",
                ephemeral: true
            })
            return;
        }

        const channelName = interaction.fields.getTextInputValue("productionChannelName");
        const eventName = interaction.fields.getTextInputValue("eventName");
        const closetLocation = interaction.fields.getTextInputValue("closetLocation");
        const closetDate = interaction.fields.getTextInputValue("closetDate")
        const closetStartEndTime = interaction.fields.getTextInputValue("times").split(" ");

        const date = moment(closetDate, "YYYYMMDD").format("dddd MMMM DD YYYY");
        const closetTime = moment(closetStartEndTime[0], "HHmm").format("HH:mm") + ` ${closetStartEndTime[1]}`;
        const startTime = moment(closetStartEndTime[2], "HHmm").format("HH:mm") + ` ${closetStartEndTime[3]}`;
        const endTime = moment(closetStartEndTime[4], "HHmm").format("HH:mm") + ` ${closetStartEndTime[5]}`;

        let volunteers = `(${currentProduction.volunteers.length}) `
        for (const volunteer of currentProduction.volunteers)
            volunteers += `<@${volunteer}> `;

        const production = new EmbedBuilder()
            .setColor("Red")
            .setTitle(eventName)
            .setDescription(date)
            .addFields(
                { name: "Closet", value: `${closetLocation} @ ${closetTime}` },
                { name: "Start", value: `${startTime}` },
                { name: "End", value: `${endTime}` },
                { name: "Channel", value: `${channelMention(currentProCh.id)}`}
            );
        if (volunteers.length === 0 )
            production.addFields({ name: "Volunteers", value: "(0) 🦗"})
        else
            production.addFields({ name: "Volunteers", value: `${volunteers}`});

        const volChl = interaction.guild?.channels.cache.find(ch => ch.id === proChannel) as GuildTextBasedChannel;
        const volunteerMsg = await volChl.messages.fetch(currentProduction.volunteerMsgId);

        const unVolChl = interaction.guild?.channels.cache.find(ch => ch.id === currentProduction.channelId) as GuildTextBasedChannel;
        const unVolunteerMsg = await unVolChl.messages.fetch(currentProduction.unVolunteerMsgId);
        await productionsRef.update({
            productions: FieldValue.arrayRemove(currentProduction)
        })
        currentProduction = {
            channelName: channelName,
            eventName: eventName,
            channelId: interaction.channelId,
            volunteerMsgId: volunteerMsg.id,
            unVolunteerMsgId: unVolunteerMsg.id,
            closetLocation: closetLocation,
            closetTime: closetTime,
            date: date,
            startTime: startTime,
            endTime: endTime,
            volunteers: currentProduction.volunteers,
            inputValueClosetDate: interaction.fields.getTextInputValue("closetDate"),
            inputValueTime: interaction.fields.getTextInputValue("times")
        }
        await productionsRef.update({
            productions: FieldValue.arrayUnion(currentProduction)
        })

        await currentProCh.setName(channelName);

        volunteerMsg.edit({ embeds: [production] });
        unVolunteerMsg.edit({ embeds: [production] });

        await interaction.reply({
            content: "Successfully edited",
            ephemeral: true
        });
    }
}