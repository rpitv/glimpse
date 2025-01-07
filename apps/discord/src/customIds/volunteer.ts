import { CustomId, ProductionDiscordData } from "../types";
import { ButtonInteraction, EmbedBuilder, ThreadChannel, userMention } from "discord.js";
import {getDiscordDataFromProduction, getProductionFromMessageFooter, glimpseApi, updateVolunteers} from "../util";
import {UserError} from "../api";

export const volunteer: CustomId = {
  name: "volunteer",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      let production = await getProductionFromMessageFooter(interaction.message);
      const oldValidRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      const user = (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData();
      if(!user) {
          throw new UserError("You must register for the RPI TV website using the `/register` command before volunteering for a production.")
      }
      const oldUser = oldValidRSVPs.find((rsvp) => rsvp.userId === user.id);
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, production.id, true, null);
      const updatedProduction = await glimpseApi.getProductionData(production.id).then((data) => data.getData());
      if(!updatedProduction) {
        throw new Error(`Production ${production.id} was deleted while updating a user's volunteer status.`)
      }
      production = updatedProduction;
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      // Should the user have already volunteered and not have notes previously...
      if (oldValidRSVPs.length === validRSVPs.length && !oldUser?.notes) return await interaction.editReply(`You have already volunteered for this production!`);

      const volunteerEmbed = interaction.message.embeds[0];
      if(!volunteerEmbed || !volunteerEmbed.data.fields || volunteerEmbed.data.fields.length < 1) {
        throw new Error('Unexpected number of fields on the volunteer message embed, or missing embed')
      }

      let volunteers = ``;
      volunteers = (await updateVolunteers(validRSVPs)).volunteers;
      volunteerEmbed.data.fields[volunteerEmbed.data.fields.length - 1].value = volunteers;
      await interaction.message.edit({ embeds: [volunteerEmbed] });

      const discordData = getDiscordDataFromProduction(production);
      const threadChannel = await interaction.guild!.channels.fetch(discordData.threadChannelId) as ThreadChannel | null;
      const threadMessage = await threadChannel?.fetchStarterMessage();

      if(threadMessage) {
        const threadEmbed = new EmbedBuilder(threadMessage.embeds[0]?.data ?? {});
        // -2 because the last field is the volunteer with notes field.
        if(!threadEmbed || !threadEmbed.data.fields || threadEmbed.data.fields.length < 2) {
          throw new Error('Unexpected number of fields on the unvolunteer thread embed, or missing embed')
        }
        threadEmbed.data.fields[threadEmbed.data.fields.length - 2].value = volunteers;
        threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = (await updateVolunteers(validRSVPs)).volunteerNotes;
        await threadMessage.edit({ embeds: [threadEmbed] });
      } else {
        console.warn(`Missing thread starter message for thread ${discordData.threadChannelId}. Skipping edit.`)
      }

      if (oldValidRSVPs.length !== validRSVPs.length) {
        await threadChannel?.send(`${userMention(interaction.user.id)} has volunteered for this production!`);
        await interaction.editReply(`You have volunteered for this production!`);
      } else {
        await threadChannel?.send(`${userMention(interaction.user.id)} has removed their notes for this production!`);
        await interaction.editReply(`You have removed your notes for this production!`);
      }

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
