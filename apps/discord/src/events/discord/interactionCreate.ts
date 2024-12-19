import { DiscordEvent } from "../../types";
import {ButtonInteraction, ChatInputCommandInteraction, Events, ModalSubmitInteraction} from "discord.js";
// import commands from "../../commands";

export const interactionCreate: DiscordEvent = {
  name: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction) {
    if (interaction.isButton()) {
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
