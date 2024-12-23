import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, ThreadChannel, userMention } from "discord.js";
import { CustomId, ProductionDiscordData } from "../types";
import { glimpseApi } from "../util";

export const unvolunteer: CustomId = {
  name: "unvolunteer",
  async execute(interaction: ButtonInteraction) {
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    try {
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, false);
      const production = await glimpseApi.getProductionData(productionId);

      const threadChannel = await interaction.guild.channels.fetch(interaction.channelId) as ThreadChannel;
      await threadChannel.members.fetch(interaction.user.id).then(member => member.remove());

      // TODO: Add code to update the embed with the new volunteer count.
    } catch (e) {
      if (e.toString().startsWith("DiscordAPIError[10007]: Unknown Member")) return await interaction.reply(`You are not a volunteer for this production!`);
      return await interaction.reply(`${e}`);
    }    
  }
}
