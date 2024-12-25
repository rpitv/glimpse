import { CustomId, ProductionDiscordData } from "../types";
import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, ThreadChannel, userMention } from "discord.js";
import { glimpseApi } from "../util";
import { Production } from "../api/types";

export const volunteer: CustomId = {
  name: "volunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    
    try {
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, true);
      const volunteerEmbed = message.embeds[0];
      const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      
      const modifiableProduction = glimpseApi.mockData.productions.find((p) => p.id === productionId) as Production;
      if (!modifiableProduction.rsvps)
        modifiableProduction.rsvps = [];
      
      // Temporary solution (Needs to check for the same users and prevent them from RSVPing twice)
      modifiableProduction.rsvps.push({ userId: (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData().id, productionId: productionId, willAttend: "yes" });

      let volunteers = ``;
      for (const rsvp of modifiableProduction.rsvps) {
        const user = (await glimpseApi.getUserFromUserId(rsvp.userId)).getData();
        if (user.discord)
          volunteers += ` ${userMention(user.discord)}`;
        // Some users may not have discord
        else
          volunteers += ` \`${user.username}\``;
      }
      volunteers = `(${modifiableProduction.rsvps.length})` + volunteers;
      volunteerEmbed.data.fields[4].value = volunteers;

      const threadId = production.discordData as ProductionDiscordData;
      const threadChannel = await interaction.guild.channels.fetch(threadId.threadChannelId) as ThreadChannel;

      const threadMessage = await threadChannel.fetchStarterMessage();
      const threadEmbed = threadMessage.embeds[0];
      threadEmbed.data.fields[4].value = volunteers;

      await message.edit({ embeds: [volunteerEmbed] });
      await threadMessage.edit({ embeds: [threadEmbed] });
      await threadChannel.send(`${userMention(interaction.user.id)} has volunteered for this production!`);

      // TODO: Add code to update the embed with the new volunteer count.
      await interaction.editReply(`You have volunteered for this production!`);
    } catch (e) {
      return await interaction.editReply(`${e}`);
    }
  }
}
