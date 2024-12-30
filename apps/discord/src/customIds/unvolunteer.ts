import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, TextChannel, ThreadChannel, userMention } from "discord.js";
import { CustomId, ProductionDiscordData } from "../types";
import { glimpseApi } from "../util";
import { Production } from "../api/types";

export const unvolunteer: CustomId = {
  name: "unvolunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    try {
      // Check if the user exists in the production's RSVP list.
      
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, false);
      // Data doesn't get updated so...
      const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      
      const threadEmbed = message.embeds[0];
      let volunteers = ``;
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      if (validRSVPs.length === 0) {
        volunteers = `(0) 🦗`;
      } else {
        for (const rsvp of validRSVPs) {
          if (rsvp.willAttend === "no") continue;
          const user = (await glimpseApi.getUserFromUserId(rsvp.userId)).getData();
          if (user.discord)
            volunteers += ` ${userMention(user.discord)}`;
          // Some users may not have discord
          else
            volunteers += ` \`${user.username}\``;
        }
        volunteers = `(${validRSVPs.length})` + volunteers;
      }
      threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = volunteers;

      const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;

      const volunteerChannel = await interaction.guild.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
      const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);
      const volunteerEmbed = volunteerMessage.embeds[0];
      volunteerEmbed.data.fields[volunteerEmbed.data.fields.length - 1].value = volunteers;

      const threadChannel = await interaction.guild.channels.fetch(interaction.channelId) as ThreadChannel;
      // Remove them if they're following the channel.
      const threadEmbedMessage = await threadChannel.fetchStarterMessage();
      await volunteerMessage.edit({ embeds: [volunteerEmbed] });
      await threadEmbedMessage.edit({ embeds: [threadEmbed] });

      // If they unvolunteer and they're not in the channel, doesn't matter, just display the unvolunteer message.
      try {
        await threadChannel.members.fetch(interaction.user.id).then(member => {
          member.remove();
        });
      } catch (e) {};
      await interaction.editReply(`You have unvolunteered for this production!`);
    } catch (e) {
      return await interaction.editReply(`${e}`);
    }    
  }
}
