import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, userMention } from "discord.js";
import { CustomId } from "../types";

export const unvolunteer: CustomId = {
  name: "unvolunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
  }
}
