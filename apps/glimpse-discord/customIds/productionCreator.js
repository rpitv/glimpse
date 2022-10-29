const moment = require('moment');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js')
const { db } = require('../firebase');
const { FieldValue } = require('firebase-admin/firestore');

module.exports = { 
    name: 'productionCreation',
    async execute(interaction) {
        const setupRef = db.collection('rpi-tv').doc('setup');
        const setupData = await setupRef.get();
        const { proCategory, proChannel } = setupData.data();
        const productionsRef = db.collection('rpi-tv').doc('productions');

        const channelName = interaction.fields.getTextInputValue('productionChannelName');
        const eventName = interaction.fields.getTextInputValue('eventName');
        const closetLocation = interaction.fields.getTextInputValue('closetLocation');
        const closetTimeAndDate = interaction.fields.getTextInputValue('closetTime').split(' ');
        const startEndTime = interaction.fields.getTextInputValue('startEndTime').split(' ');

        const closetTime = moment(closetTimeAndDate[0], 'HHmm').format('HH:mm') + ` ${closetTimeAndDate[1]}`;
        const date = moment(closetTimeAndDate[2], 'YYYYMMDD').format('dddd MMMM DD YYYY');
        const startTime = moment(startEndTime[0], "HHmm").format('HH:mm') + ` ${startEndTime[1]}`;
        const endTime = moment(startEndTime[2], "HHmm").format('HH:mm') + ` ${startEndTime[3]}`;
        
        const production = new EmbedBuilder()
            .setColor('Red')
            .setTitle(eventName)
            .setDescription(date)
            .addFields(
                { name: 'Closet', value: `${closetLocation} @ ${closetTime}` },
                { name: 'Start', value: `${startTime}` },
                { name: 'End', value: `${endTime}` },
                { name: 'Volunteers', value: '🦗'}
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
            permissionOverwrites: [{
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
            }],
            parent: proCategory
        }).then(async channel => {
            const volunteerMsg = await interaction.guild.channels.cache.get(proChannel).send({ 
                embeds: [production], 
                components: [volunteerBtn] 
            });
            const unVolunteerMsg = await channel.send({
                embeds: [production], 
                components: [unVolunteerBtn]
            });
            if (!await productionsRef.get().then((snapshot) => snapshot.data()))
                productionsRef.set({ productions: [{
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
                    inputValueClosetTime: interaction.fields.getTextInputValue('closetTime'),
                    inputValueStartEndTime: interaction.fields.getTextInputValue('startEndTime')
            }]})
            else
                productionsRef.update({ productions: FieldValue.arrayUnion({
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
                    inputValueClosetTime: interaction.fields.getTextInputValue('closetTime'),
                    inputValueStartEndTime: interaction.fields.getTextInputValue('startEndTime')
                })})
        })
        
        await interaction.reply({ content: 'Production succesfully created!', ephemeral: true });
    }
}