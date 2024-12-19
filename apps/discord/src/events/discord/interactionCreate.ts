import { DiscordEvent } from "../../types";
import {ButtonInteraction, ChatInputCommandInteraction, Events, ModalSubmitInteraction} from "discord.js";
// import commands from "../../commands";

export const interactionCreate: DiscordEvent = {
  name: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction) {

    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (e) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        console.error(e);
      }
    }

    if (interaction.isButton() || interaction.isModalSubmit()) {
      const customId = interaction.client.customIds.get(interaction.customId);
      if (!customId) return;
      try {
        customId.execute(interaction);
      } catch (e) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        console.error(e);
      }
    }
  }
}
