import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { CustomId } from "../types";
import {getDiscordUserDisplayName, getProductionFromMessageFooter } from "../util";
import {UserError} from "../api";

export const getVolunteerWithNotes: CustomId = {
  name: "getVolunteerNotes",
  async execute(interaction: ButtonInteraction) {

    try {
      await interaction.deferReply({ ephemeral: true });
      const production = await getProductionFromMessageFooter(interaction.message);

      let volunteerNotes = ``;
      const embed = new EmbedBuilder().setTitle("Volunteer Notes").setColor("#d6001c");
      // FIXME maybe prone to error in edge cases. Notes don't have a length limit.
      for (const rsvp of production.rsvps) {
        if (!rsvp.notes) continue;
        const userName = await getDiscordUserDisplayName(rsvp.userId)
        volunteerNotes += `**__${userName} Notes__**\n${rsvp.notes}\n\n`;
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
        if(e instanceof UserError) {
            return await interaction.editReply(e.message);
        } else {
            console.error(e);
            return await interaction.editReply(`There was an error! Contact an officer or developer.`);
        }
    }
  }
}
