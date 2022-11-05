const { ActionRowBuilder, SelectMenuBuilder, PermissionsBitField } = require('discord.js')

module.exports = { 
    name: 'proChannel',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return interaction.reply({content: 'You are not an officer!', ephemeral: true});
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('proChannelSelection')
            .setPlaceholder('Select a channel for productions')
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