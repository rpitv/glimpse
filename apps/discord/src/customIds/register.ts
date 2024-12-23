import { ModalSubmitInteraction } from "discord.js";
import { CustomId } from "../types";
import { glimpseApi } from "../util";

export const register: CustomId = {
  name: "register",
  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const fields = interaction.fields.fields;
    const username = fields.get("username").value;
    const email = fields.get("email").value;

    try {
      const user = await glimpseApi.registerUser(interaction.user.id, username, email);
      const userData = user.getData();
      await interaction.editReply({ content: `You are user ${userData.id}`});
    } catch (e) {
      await interaction.editReply({ content: `${e}` });
    }

    // { id: 74n, username: 'aaa', mail: 'a', discord: '283754983415873536' }
    
  }
}
