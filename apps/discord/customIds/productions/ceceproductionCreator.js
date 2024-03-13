const moment = require('moment');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField, channelMention} = require('discord.js')
const { FieldValue } = require('firebase-admin/firestore');
const { db } = require('../../firebase');
const dotenv = require('dotenv');

dotenv.config()

module.exports = {
    name: 'ceceproductionCreator',
    async execute(interaction) {
        const setupRef = db.collection('rpi-tv').doc('setup');
        const setupData = await setupRef.get();
        const { proCategory, proChannel } = setupData.data();
        const productionsRef = db.collection('rpi-tv').doc('productions');

        const channelName = interaction.fields.getTextInputValue('ceceproductionChannelName');
        const event = interaction.fields.getTextInputValue('event');

        let productionDetails = event.split("\n");

        let eventName = productionDetails[0];
        let date = productionDetails[1].replace("Date:", "").trim();
        let [closetLocation, closetTime] = productionDetails[2].replace("Closet @", "").split(": ");
        let startTime = productionDetails[3].replace("Start:", "").trim();
        let endTime = productionDetails[4].replace("End:", "").trim();

        let [dayOfWeek, month, day, year] = date.split(" ");
        day = day.replace(/\D/g, "");
        date = [month, day, year].join(" ");
        date = new Date(`${date} ${closetTime}`);
        const production = new EmbedBuilder()
            .setColor('Red')
            .setTitle(eventName, "@", )
            .setDescription(date.toDateString())
            .addFields(
                { name: 'Closet', value: `${closetLocation} @ ${closetTime}` },
                { name: 'Start', value: `${startTime}` },
                { name: 'End', value: `${endTime}` },
            )

        const volunteerBtn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('volunteer')
                    .setLabel('Volunteer')
                    .setStyle(ButtonStyle.Success)
            )

        const unVolunteerBtn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('unvolunteer')
                    .setLabel('Unvolunteer')
                    .setStyle(ButtonStyle.Danger)
            )
        interaction.guild.channels.create({
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
        }).then(async channel => {
            production.addFields(
                { name: "Channel", value: `${channelMention(channel.id)}`},
                { name: 'Volunteers', value: '(0) 🦗'})
            const volunteerMsg = await interaction.guild.channels.cache.get(proChannel).send({
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
                    }]})
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
                    })})
        })

        await interaction.reply({ content: 'Production successfully created!', ephemeral: true });
    }
}
