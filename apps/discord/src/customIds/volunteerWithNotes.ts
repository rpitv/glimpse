import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CustomId } from "../types";
import { glimpseApi } from "../util";

export const volunteerWithNotes: CustomId = {
  name: "volunteerWithNotes",
  async execute(interaction: ButtonInteraction) {
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
    const productionData = await glimpseApi.getProductionData(productionId).then((data) => data.getData());

    // Finds the user in the RSVP list.
    const user = productionData.rsvps.find(async (rsvp) => rsvp.userId === (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData().id);

    let notes = ``;
    if (user && user.notes)
      notes = user.notes;

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
  }
}