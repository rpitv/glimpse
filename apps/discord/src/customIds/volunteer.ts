import { CustomId } from "../types";
import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, userMention } from "discord.js";
import { MockGlimpseApi } from "../api/MockGlimpseApi";

export const volunteer: CustomId = {
  name: "volunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const glimpseApi = new MockGlimpseApi();
    const user = interaction.user;
    const message = interaction.message;
    // glimpseApi.updateUserVolunteerStatus();
  }
}
