import {CustomId} from "../../types";
import {
    ActionRowBuilder,
    ButtonInteraction,
    GuildMember,
    PermissionsBitField,
    SelectMenuBuilder
} from "discord.js";


export const proCategory: CustomId = {
    name: "proCategory",
    async execute(interaction: ButtonInteraction) {
        const member = interaction.member as GuildMember
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({content: "You are not an officer!", ephemeral: true});
        const selectMenu = new SelectMenuBuilder()
            .setCustomId("proCategorySelection")
            .setPlaceholder("Select a category for productions")
        const options = [];
        const categories = await interaction.guild?.channels.cache.filter((category) => category.type === 4);
        if (categories)
            for (const category of categories) {
                options.push({
                    label: category[1].name,
                    value: category[0]
                })
            }
        selectMenu.setOptions(options);
        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(selectMenu);
        await interaction.reply({ components: [row], ephemeral: true });
    }
}