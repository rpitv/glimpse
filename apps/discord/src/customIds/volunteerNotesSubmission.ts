import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, ThreadChannel, userMention } from "discord.js";
import { CustomId, ProductionDiscordData } from "../types";
import {getDiscordDataFromProduction, getProductionFromMessageFooter, glimpseApi, updateVolunteers} from "../util";
import { volunteer } from "./volunteer";
import {UserError} from "../api";

export const volunteerNotesSubmission: CustomId = {
  name: "volunteerNotesSubmission",
  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const fields = interaction.fields;
    const notes = fields.getTextInputValue("notes");

    try {
      if(!interaction.message) {
        throw new Error('Volunteer notes submission did not have an attached message')
      }
      let production = await getProductionFromMessageFooter(interaction.message)
      const oldValidRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      const user = (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData()
      if(!user) {
        throw new UserError("You must register for the RPI TV website using the `/register` command before volunteering for a production.")
      }
      const oldUser = oldValidRSVPs.find((rsvp) => rsvp.userId === user.id);
      await glimpseApi.updateUserVolunteerStatus(interaction.user.id, production.id, true, notes);
      const updatedProduction = await glimpseApi.getProductionData(production.id).then((data) => data.getData());
      if(!updatedProduction) {
        throw new Error(`Production ${production.id} was deleted while updating a user's volunteer status.`)
      }
      production = updatedProduction;
      const validRSVPs = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");
      // Should the user have already volunteered and not have notes previously...
      if (oldValidRSVPs.length === validRSVPs.length && oldUser?.notes === notes) return await interaction.editReply(`You have already volunteered for this production with the same notes!`);

      const volunteerEmbed = interaction.message.embeds[0];
      if(!volunteerEmbed || !volunteerEmbed.data.fields || volunteerEmbed.data.fields.length < 1) {
        throw new Error('Unexpected number of fields on the volunteer message embed, or missing embed')
      }

      let volunteers = ``;
      volunteers = (await updateVolunteers(validRSVPs)).volunteers;
      volunteerEmbed.data.fields[volunteerEmbed.data.fields.length - 1].value = volunteers;
      await interaction.message.edit({ embeds: [volunteerEmbed] });

      const discordData = getDiscordDataFromProduction(production);
      const threadChannel = await interaction.guild!.channels.fetch(discordData.threadChannelId) as ThreadChannel;
      const threadMessage = await threadChannel.fetchStarterMessage();

      if(threadMessage) {
          const threadEmbed = new EmbedBuilder(threadMessage.embeds[0]?.data ?? {});
          if(!threadEmbed || !threadEmbed.data.fields || threadEmbed.data.fields.length < 2) {
            throw new Error('Unexpected number of fields on the unvolunteer thread embed, or missing embed')
          }
          // -2 because the last field is the volunteer with notes field.
          threadEmbed.data.fields[threadEmbed.data.fields.length - 2].value = volunteers;
          threadEmbed.data.fields[threadEmbed.data.fields.length - 1].value = (await updateVolunteers(validRSVPs)).volunteerNotes;

          await threadMessage.edit({ embeds: [threadEmbed] });
      } else {
          console.warn(`Missing thread starter message for thread ${discordData.threadChannelId}. Skipping edit.`)
      }


      if (oldValidRSVPs.length !== validRSVPs.length) {
        await threadChannel.send(`${userMention(interaction.user.id)} has volunteered for this production with notes!`);
        await interaction.editReply(`You have volunteered for this production with notes!`);
      } else {
        await threadChannel.send(`${userMention(interaction.user.id)} has updated their notes for this production!`)
        await interaction.editReply(`You have updated your notes for this production!`);
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
