import {ChannelType, EmbedBuilder, ModalSubmitInteraction} from "discord.js";
import { CustomId } from "../types";
import { glimpseApi } from "../util";
import {UserError} from "../api";

export const register: CustomId = {
  name: "register",
  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const fields = interaction.fields;
    const username = fields.getTextInputValue("username");
    const email = fields.getTextInputValue("email");

    try {
      const alertsChannel = await interaction.guild!.channels.fetch(process.env.ADMIN_ALERTS_CHANNEL_ID)
      if(!alertsChannel || alertsChannel.type !== ChannelType.GuildText) {
        throw new Error('Environment variable "ADMIN_ALERTS_CHANNEL_ID" does not correspond to a found Discord Text channel.')
      }

      const user = await glimpseApi.registerUser(interaction.user.id, username, email);
      const userData = user.getData();

      const embed = new EmbedBuilder().setTitle("User Data").setColor("#d6001c")
      embed.addFields([
        { name: "User ID", value: userData.id.toString() },
        { name: "Username", value: username },
        { name: "Email", value: email },
      ])
      await alertsChannel.send({
        content: "<@" + interaction.user.id + "> created a new RPI TV account.",
        embeds: [
          embed
        ]
      })

      return await interaction.editReply({ content: `You have successfully registered! You can log in with Discord at ${process.env.WEB_URL}/login.` });
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
