const { db } = require('../../firebase');
const { FieldValue } = require('firebase-admin/firestore')

module.exports = { 
    name: 'productionCancellation',
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
        await productionsRef.update({
            productions: FieldValue.arrayRemove(currentProduction)
        }).catch(() => interaction.reply({content: 'Could not update user', ephemeral: true}));

        await interaction.guild.channels.cache.get(proChannel)
            .messages.fetch(currentProduction.volunteerMsgId).then(msg => msg.delete());

        await interaction.guild.channels.cache.get(currentProduction.channelId).delete();
    }
}