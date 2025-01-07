import { ButtonInteraction, TextChannel, ThreadChannel } from "discord.js";
import { CustomId } from "../types";
import {getDiscordDataFromProduction, getProductionFromMessageFooter, glimpseApi, updateVolunteers} from "../util";
import {UserError} from "../api";

export const unvolunteer: CustomId = {
  name: "unvolunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      let production = await getProductionFromMessageFooter(interaction.message);
      const oldValidRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      // Check if the user exists in the production's RSVP list.
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, production.id, false, null);
      const updatedProduction = await glimpseApi.getProductionData(production.id).then((data) => data.getData());
      if(!updatedProduction) {
        throw new Error(`Production ${production.id} was deleted while updating a user's volunteer status.`)
      }
      production = updatedProduction;
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      if (oldValidRSVPs.length === validRSVPs.length) return await interaction.editReply(`You never signed up for this production to begin with!`);

      const threadEmbed = interaction.message.embeds[0];
      if(!threadEmbed || !threadEmbed.data.fields || threadEmbed.data.fields.length < 2) {
        throw new Error('Unexpected number of fields on the unvolunteer thread embed, or missing embed')
      }
      let volunteers = ``;
      volunteers = (await updateVolunteers(validRSVPs)).volunteers;
      threadEmbed.data.fields[threadEmbed.data.fields.length - 2].value = volunteers;
      threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = (await updateVolunteers(validRSVPs)).volunteerNotes;

      const discordData = getDiscordDataFromProduction(production);
      const volunteerChannel = await interaction.guild!.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel | null;
      const volunteerMessage = await volunteerChannel?.messages.fetch(discordData.volunteerMessageId);
      const volunteerEmbed = volunteerMessage?.embeds[0];
      if(!volunteerEmbed || !volunteerEmbed.data.fields || volunteerEmbed.data.fields.length < 1) {
        throw new Error('Unexpected number of fields on the volunteer message embed, or missing embed')
      }
      volunteerEmbed.data.fields[volunteerEmbed.data.fields.length - 1].value = volunteers;

      const threadChannel = await interaction.guild!.channels.fetch(interaction.channelId) as ThreadChannel | null;
      const threadEmbedMessage = await threadChannel?.fetchStarterMessage();
      await volunteerMessage.edit({ embeds: [volunteerEmbed] });
      if(threadEmbedMessage) {
        await threadEmbedMessage.edit({ embeds: [threadEmbed] });
      } else {
        console.warn(`Missing thread starter message for thread ${interaction.channelId}. Skipping edit.`)
      }

      // Remove them if they're following the channel.
      await threadChannel?.members.fetch(interaction.user.id).then(member => {
        member.remove();
      });
      await interaction.editReply(`You have unvolunteered for this production!`);
    } catch (e) {
        if(e instanceof UserError) {
            return await interaction.editReply(e.message);
        } else {
            console.error(e);
            return await interaction.editReply(`There was an error! Contact an officer or developer.`);
        }
    }
  }
}
