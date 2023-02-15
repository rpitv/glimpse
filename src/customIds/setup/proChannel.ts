import {CustomId} from "../../types";
import {
    ActionRowBuilder,
    BaseGuildTextChannel,
    ButtonInteraction,
    GuildMember,
    GuildTextBasedChannel,
    PermissionsBitField,
    SelectMenuBuilder, TextChannel
} from "discord.js";


export const proChannel: CustomId = {
    name: "proChannel",
    async execute(interaction: ButtonInteraction) {
        const member = interaction.member as GuildMember
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator))
            return interaction.reply({content: "You are not an officer!", ephemeral: true});
        const selectMenu = new SelectMenuBuilder()
            .setCustomId("proChannelSelection")
            .setPlaceholder("Select a channel for productions")
        const options = [];
        const channels = interaction.guild?.channels.cache.filter((channel) => channel.type === 0);
        if (channels)
            for (const channel of channels) {
                const option = {
                    label: channel[1].name,
                    value: channel[0],
                    description: "\u200b"
                }
                const ch = channel[1] as TextChannel
                if (ch.topic)
                    option.description = ch.topic;
                options.push(option)
            }
        selectMenu.setOptions(options);
        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(selectMenu);
        await interaction.reply({ components: [row], ephemeral: true });
    }
}