const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

module.exports = { 
    name: 'proChannel',
    async execute(interaction) {
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('proChannelSelection')
            .setPlaceholder('Select a channel')
        const options = [];
        const channels = await interaction.guild.channels.cache.filter((channel) => channel.type === 0);
        for  (const channel of channels) {
            const option = {
                label: channel[1].name,
                value: channel[0]
            }
            if (channel[1].topic)
                option.description = channel[1].topic;
            options.push(option)
        }
        selectMenu.setOptions(options);
        const row = new ActionRowBuilder()
            .addComponents(selectMenu);
        await interaction.reply({ components: [row], ephemeral: true });
    }
}