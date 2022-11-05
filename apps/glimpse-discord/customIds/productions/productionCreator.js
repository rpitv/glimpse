const moment = require('moment');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js')
const { FieldValue } = require('firebase-admin/firestore');
const { db } = require('../../firebase');

module.exports = { 
    name: 'productionCreator',
    async execute(interaction) {
        const setupRef = db.collection('rpi-tv').doc('setup');
        const setupData = await setupRef.get();
        const { proCategory, proChannel } = setupData.data();
        const productionsRef = db.collection('rpi-tv').doc('productions');

        const channelName = interaction.fields.getTextInputValue('productionChannelName');
        const eventName = interaction.fields.getTextInputValue('eventName');
        const closetLocation = interaction.fields.getTextInputValue('closetLocation');
        const closetDate = interaction.fields.getTextInputValue('closetDate')
        const closetStartEndTime = interaction.fields.getTextInputValue('times').split(' ');

        const date = moment(closetDate, 'YYYYMMDD').format('dddd MMMM DD YYYY');
        const closetTime = moment(closetStartEndTime[0], 'HHmm').format('HH:mm') + ` ${closetStartEndTime[1]}`;
        const startTime = moment(closetStartEndTime[2], "HHmm").format('HH:mm') + ` ${closetStartEndTime[3]}`;
        const endTime = moment(closetStartEndTime[4], "HHmm").format('HH:mm') + ` ${closetStartEndTime[5]}`;
        
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
            }).then(async (msg) => await msg.pin());
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
                    inputValueClosetDate: interaction.fields.getTextInputValue('closetDate'),
                    inputValueTime: interaction.fields.getTextInputValue('times')
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
                    inputValueClosetDate: interaction.fields.getTextInputValue('closetDate'),
                    inputValueTime: interaction.fields.getTextInputValue('times')
                })})
        })
        
        await interaction.reply({ content: 'Production succesfully created!', ephemeral: true });
    }
}