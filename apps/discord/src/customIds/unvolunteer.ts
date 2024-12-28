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
      const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      const modifiableProduction = glimpseApi.mockData.productions.find((p) => p.id === productionId) as Production;
      const userIndex = async (rsvp) => rsvp.userId === (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData().id;
      const rsvpIndex = modifiableProduction.rsvps.findIndex(userIndex);
      if (rsvpIndex === -1) return await interaction.editReply(`You are not a volunteer for this production!`);

      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, false);      
      modifiableProduction.rsvps.splice(rsvpIndex, 1);

      const threadEmbed = message.embeds[0];
      let volunteers = ``;
      if (modifiableProduction.rsvps.length === 0) {
        volunteers = `(0) 🦗`;
      } else {
        for (const rsvp of modifiableProduction.rsvps) {
          const user = (await glimpseApi.getUserFromUserId(rsvp.userId)).getData();
          if (user.discord)
            volunteers += ` ${userMention(user.discord)}`;
          // Some users may not have discord
          else
            volunteers += ` \`${user.username}\``;
        }
        volunteers = `(${modifiableProduction.rsvps.length})` + volunteers;
      }
      threadEmbed.data.fields[4].value = volunteers;

      const volunteerChannel = await interaction.guild.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
      const volunteerMessage = await volunteerChannel.messages.fetch(production.discordData.volunteerMessageId);
      const volunteerEmbed = volunteerMessage.embeds[0];
      volunteerEmbed.data.fields[4].value = volunteers;

      const threadChannel = await interaction.guild.channels.fetch(interaction.channelId) as ThreadChannel;
      // Remove them if they're following the channel.
      await threadChannel.members.fetch(interaction.user.id).then(member => {
        if (member) member.remove();
      });
      const threadEmbedMessage = await threadChannel.fetchStarterMessage();
      await volunteerMessage.edit({ embeds: [volunteerEmbed] });
      await threadEmbedMessage.edit({ embeds: [threadEmbed] });

      await interaction.editReply(`You have unvolunteered for this production!`);
    } catch (e) {
      return await interaction.editReply(`${e}`);
    }    
  }
}
