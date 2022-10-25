module.exports = {
    name: 'delete',
    async execute(interaction) {
        if (interaction.message)
            await interaction.message.delete();
    }
}