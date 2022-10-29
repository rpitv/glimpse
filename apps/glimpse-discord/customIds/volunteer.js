const { db } = require('../firebase');
const { FieldValue } = require('firebase-admin/firestore');
const { EmbedBuilder } = require('discord.js')


module.exports = {
    name: 'volunteer',
    async execute(interaction) {
        const setupRef = await db.collection('rpi-tv').doc('setup').get();
        const { proChannel } = setupRef.data();
        const productionsRef = db.collection('rpi-tv').doc('productions')
        await productionsRef.get().then(async (production) => {
            let currentProduction = production.data().productions.find(prod => prod.volunteerMsgId === interaction.message.id);
            if (currentProduction.volunteers.find(volunteer => volunteer === interaction.user.id)) {
                interaction.reply({
                    content: 'You have already applied to volunteer for this event',
                    ephemeral: true
                })
                return;
            }
            await productionsRef.update({
                productions: FieldValue.arrayRemove(currentProduction)
            }).catch(() => interaction.reply({content: 'Could not update user', ephemeral: true}));
            currentProduction.volunteers.push(interaction.user.id);
            await productionsRef.update({
                productions: FieldValue.arrayUnion(currentProduction)
            }).catch(() => interaction.reply({content: 'Could not update user', ephemeral: true}));
            const volunteerMsg = await interaction.guild.channels.cache.find(proChannel)
                .messages.fetch(currentProduction.volunteerMsgId);
            let volunteers = ``
            for (let i = 0; i < currentProduction.volunteers.length; i++)
                volunteers += `<@${currentProduction.volunteers[i]}> `;
            let field = volunteerMsg.embeds[0].data.fields
            field[3] = {
                name: 'Volunteers',
                value: volunteers
            }
            const unVolunteerMsg = await interaction.guild.channels.cache.get(currentProduction.channelId)
                .messages.fetch(currentProduction.unVolunteerMsgId);
            let updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
            volunteerMsg.edit({embeds: [updatedProduction]});
            unVolunteerMsg.edit({embeds: [updatedProduction]});
            let currProChannel = await interaction.guild.channels.cache.find(ch => ch.id === currentProduction.channelId)
            await currProChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true} );
            interaction.reply({
                content: 'Successfully volunteered!',
                ephemeral: true
            })
        });
    }
}