import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CustomId } from "../types";
import {getProductionFromMessageFooter, glimpseApi} from "../util";
import {UserError} from "../api";

export const volunteerWithNotes: CustomId = {
  name: "volunteerWithNotes",
  async execute(interaction: ButtonInteraction) {

    try {
      const production = await getProductionFromMessageFooter(interaction.message)
      const user = (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData()
      if(!user) {
        throw new UserError("You must register for the RPI TV website using the `/register` command before volunteering for a production.")
      }

      // Finds the user in the RSVP list to prefill notes if they've already volunteered
      const userRSVP = production.rsvps.find(async (rsvp) => rsvp.userId === user.id);

      let notes = ``;
      if (userRSVP && userRSVP.notes)
        notes = userRSVP.notes;

      const modal = new ModalBuilder()
        .setTitle(`Volunteer Notes`)
        .setCustomId("volunteerNotesSubmission");

      const notesField = new TextInputBuilder()
        .setCustomId("notes")
        .setLabel("Any notes about your attendance")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("I will be late to the production, arriving at 7:30 PM.")
        .setRequired(true)
        .setValue(notes)
        .setMaxLength(100);


        const usernameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(notesField);
        modal.addComponents(usernameRow);
        await interaction.showModal(modal);
    } catch(e) {
      if(e instanceof UserError) {
        return await interaction.editReply(e.message);
      } else {
        console.error(e);
        return await interaction.editReply(`There was an error! Contact an officer or developer.`);
      }
    }
  }
}
