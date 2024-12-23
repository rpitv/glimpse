import { CustomId, ProductionDiscordData } from "../types";
import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, ThreadChannel, userMention } from "discord.js";
import { glimpseApi } from "../util";

export const volunteer: CustomId = {
  name: "volunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    try {
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, true);
      const production = await glimpseApi.getProductionData(productionId);

      const threadId = production.getData().discordData as ProductionDiscordData;
      const threadChannel = await interaction.guild.channels.fetch(threadId.threadChannelId) as ThreadChannel;
      await threadChannel.send(`${userMention(interaction.user.id)} has volunteered for this production!`);

      // TODO: Add code to update the embed with the new volunteer count.
      await interaction.editReply(`You have volunteered for this production!`);
    } catch (e) {
      return await interaction.editReply(`${e}`);
    }
  }
}
