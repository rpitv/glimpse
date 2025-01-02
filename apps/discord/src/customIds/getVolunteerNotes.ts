import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, userMention } from "discord.js";
import { CustomId } from "../types";
import { glimpseApi } from "../util";

export const getVolunteerWithNotes: CustomId = {
  name: "getVolunteerNotes",
  async execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const message = interaction.message;
    const productionId = BigInt(message.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);

    try {
      let volunteerNotes = ``;
      const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
      const embed = new EmbedBuilder().setTitle("Volunteer Notes").setColor("#d6001c");
      for (const rsvp of production.rsvps) {
        if (!rsvp.notes) continue;
        const user = await glimpseApi.getUserFromUserId(rsvp.userId).then((data) => data.getData());
        volunteerNotes += `**__${userMention(user.discord)} Notes__**\n${rsvp.notes}\n\n`;
        if (volunteerNotes.length >= 850) {
          embed.addFields({
            name: "\u200b",
            value: volunteerNotes,
            inline: false
          });
          volunteerNotes = ``;
        }
      }

      if (volunteerNotes.length > 0) {
        embed.addFields({
          name: "\u200b",
          value: volunteerNotes,
          inline: false
        });
      }


      await interaction.editReply({ embeds: [embed] });
    } catch(e) {
      await interaction.editReply(`${e}`);
    }
  }
}