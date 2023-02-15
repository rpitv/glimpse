import { Event } from "../types";
import {ChatInputCommandInteraction, Events, ModalSubmitInteraction, SelectMenuInteraction} from "discord.js";

export const interactionCreate: Event = {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction | ModalSubmitInteraction | SelectMenuInteraction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
        if (interaction.isButton() || interaction.isModalSubmit() || interaction.isSelectMenu()) {
            const customId = interaction.client.customIds.get(interaction.customId);
            if (!customId) return;
            try {
                await customId.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
    }
}