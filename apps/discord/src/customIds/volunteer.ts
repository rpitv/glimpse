import { CustomId, ProductionDiscordData } from "../types";
import { ButtonInteraction, EmbedBuilder, ThreadChannel, userMention } from "discord.js";
import { glimpseApi, updateVolunteers } from "../util";

export const volunteer: CustomId = {
  name: "volunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    
    try {
      let production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      const oldValidRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, productionId, true, null);
      production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());

      const volunteerEmbed = message.embeds[0];
      
      let volunteers = ``;
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      volunteers = (await updateVolunteers(validRSVPs)).volunteers;
      volunteerEmbed.data.fields[volunteerEmbed.data.fields.length - 1].value = volunteers;

      const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
      const threadChannel = await interaction.guild.channels.fetch(discordData.threadChannelId) as ThreadChannel;
      const threadMessage = await threadChannel.fetchStarterMessage();
      const threadEmbed = new EmbedBuilder(threadMessage.embeds[0]);
      // -2 because the last field is the volunteer with notes field.
      threadEmbed.data.fields[threadEmbed.data.fields.length - 2].value = volunteers;
      threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = (await updateVolunteers(validRSVPs)).volunteerNotes;

      await message.edit({ embeds: [volunteerEmbed] });
      await threadMessage.edit({ embeds: [threadEmbed] });
      if (oldValidRSVPs.length !== validRSVPs.length)
        await threadChannel.send(`${userMention(interaction.user.id)} has volunteered for this production!`);

      await interaction.editReply(`You have volunteered for this production!`);
    } catch (e) {
      return await interaction.editReply(`${e}`);
    }
  }
}