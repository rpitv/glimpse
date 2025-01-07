import { ModalSubmitInteraction } from "discord.js";
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
      const user = await glimpseApi.registerUser(interaction.user.id, username, email);
      const userData = user.getData();
      console.log(userData);
      await interaction.editReply({ content: `You have successfully registered! You can sign in via discord at our [website](http://rpi.tv/)` });
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
