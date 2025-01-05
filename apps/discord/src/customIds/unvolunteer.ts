import { BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, TextChannel, ThreadChannel, userMention } from "discord.js";
import { CustomId, ProductionDiscordData } from "../types";
import { glimpseApi, updateVolunteers } from "../util";
import { Production } from "../api/types";

export const unvolunteer: CustomId = {
  name: "unvolunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    try {
      let production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      const oldValidRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      // Check if the user exists in the production's RSVP list.
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, false, null);
      production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      if (oldValidRSVPs.length === validRSVPs.length) return await interaction.editReply(`You never signed up for this production to begin with!`);

      const threadEmbed = message.embeds[0];
      let volunteers = ``;
      volunteers = (await updateVolunteers(validRSVPs)).volunteers;
      threadEmbed.data.fields[threadEmbed.data.fields.length - 2].value = volunteers;
      threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = (await updateVolunteers(validRSVPs)).volunteerNotes;

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

      await threadChannel.members.fetch(interaction.user.id).then(member => {
        member.remove();
      });
      await interaction.editReply(`You have unvolunteered for this production!`);
    } catch (e) {
        if(e instanceof Error && e.message.startsWith("User Error: ")) {
            return await interaction.editReply(`${e.message.substring("User Error: ".length)}`);
        } else {
            console.error(e);
            return await interaction.editReply(`There was an error! Contact an officer or developer.`);
        }
    }
  }
}
