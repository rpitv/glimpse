import {Command} from "../types";
import {
    ActionRowBuilder,
    ModalBuilder,
    SlashCommandBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {sendRPC} from "../amqp";

export const register: Command = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for RPI TV Glimpse"),
    async execute(interaction) {
        // Check if a user is already registered with this Discord account connected
        const currentUser = (await sendRPC<any[]>("findManyUser", {
            filter: {
                discord: { equals: interaction.user.id }
            },
            pagination: { take: 1 }
        }))[0]

        if (currentUser) {
            await interaction.reply({
                content: "You already have a Glimpse account. Contact an officer if you need help.",
                ephemeral: true
            })
            return;
        }

        const createAccountModal = new ModalBuilder()
            .setCustomId("register")
            .setTitle("Create Account");

        const username = new TextInputBuilder()
            .setCustomId("username")
            .setRequired(true)
            .setLabel("Username")
            .setPlaceholder("Ideally your RCS ID")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(8);
        const email = new TextInputBuilder()
            .setCustomId("email")
            .setRequired(true)
            .setLabel("Email")
            .setPlaceholder("Ideally your RCS email, if you have one")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(320);

        const usernameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(username);
        const emailRow = new ActionRowBuilder<TextInputBuilder>().addComponents(email);

        createAccountModal.addComponents(usernameRow, emailRow);

        await interaction.showModal(createAccountModal);
    }
}
