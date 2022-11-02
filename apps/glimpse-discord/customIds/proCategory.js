const { ActionRowBuilder, SelectMenuBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'proCategory',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return interaction.reply({content: 'You are not an officer!', ephemeral: true});
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('proCategorySelection')
            .setPlaceholder('Select a category')
        const options = [];
        const categories = await interaction.guild.channels.cache.filter((category) => category.type === 4);
        for (const category of categories) {
            const option = {
                label: category[1].name,
                value: category[0]
            }
            options.push(option)
        }
        selectMenu.setOptions(options);
        const row = new ActionRowBuilder()
            .addComponents(selectMenu);
        await interaction.reply({ components: [row], ephemeral: true });
    }
}