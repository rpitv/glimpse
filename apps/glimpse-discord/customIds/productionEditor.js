const moment = require('moment');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js')
const { db } = require('../firebase');
const { FieldValue } = require('firebase-admin/firestore');

module.exports = { 
    name: 'productionEditor',
    async execute(interaction) {
        const setupRef = db.collection('rpi-tv').doc('setup');
        const setupData = await setupRef.get();
        const { proCategory, proChannel } = setupData.data();
        const productionsRef = db.collection('rpi-tv').doc('productions');
        const productionsData = await productionsRef.get();
        let currentProduction = productionsData.data().productions.find((production) => production.channelId === interaction.channelId);

        if (!currentProduction) {
            interaction.reply({
                content: 'Production not found! Please head to the channel of the production you want to edit',
                ephemeral: true
            })
            return;
        }
        
        const channelName = interaction.fields.getTextInputValue('productionChannelName');
        const eventName = interaction.fields.getTextInputValue('eventName');
        const closetLocation = interaction.fields.getTextInputValue('closetLocation');
        const closetTimeAndDate = interaction.fields.getTextInputValue('closetTime').split(' ');
        const startEndTime = interaction.fields.getTextInputValue('startEndTime').split(' ');

        const closetTime = moment(closetTimeAndDate[0], 'HHmm').format('HH:mm') + ` ${closetTimeAndDate[1]}`;
        const date = moment(closetTimeAndDate[2], 'YYYYMMDD').format('dddd MMMM DD YYYY');
        const startTime = moment(startEndTime[0], "HHmm").format('HH:mm') + ` ${startEndTime[1]}`;
        const endTime = moment(startEndTime[2], "HHmm").format('HH:mm') + ` ${startEndTime[3]}`;
        
        let volunteers = ``
        for (const volunteer of currentProduction.volunteers)
            volunteers += `<@${volunteer}> `;
        
        const production = new EmbedBuilder()
            .setColor('Red')
            .setTitle(eventName)
            .setDescription(date)
            .addFields(
                { name: 'Closet', value: `${closetLocation} @ ${closetTime}` },
                { name: 'Start', value: `${startTime}` },
                { name: 'End', value: `${endTime}` },
            ) 
        if (volunteers.length === 0 )
            production.addFields({ name: 'Volunteers', value: '🦗'})
        else 
            production.addFields({ name: 'Volunteers', value: `${volunteers}`});
        const volunteerMsg = await interaction.guild.channels.cache.find(ch => ch.id === proChannel)
            .messages.fetch(currentProduction.volunteerMsgId);
        const unVolunteerMsg = await interaction.guild.channels.cache.find(ch => ch.id === currentProduction.channelId)
            .messages.fetch(currentProduction.unVolunteerMsgId);
        productionsRef.update({
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
            inputValueClosetTime: interaction.fields.getTextInputValue('closetTime'),
            inputValueStartEndTime: interaction.fields.getTextInputValue('startEndTime')
        }
        productionsRef.update({
            productions: FieldValue.arrayUnion(currentProduction)
        })
        interaction.guild.channels.cache.find((channel) => channel.id === interaction.channelId).setName(channelName);
        volunteerMsg.edit({ embeds: [production] })
        unVolunteerMsg.edit({ embeds: [production] })
        interaction.reply({
            content: 'Successfully edited',
            ephemeral: true
        })
    }
}