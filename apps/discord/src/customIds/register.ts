import { BaseGuildTextChannel, ModalSubmitInteraction, EmbedBuilder, userMention, codeBlock } from "discord.js";
import { CustomId } from "../types";
import { MockGlimpseApi } from "../api/MockGlimpseApi";

export const register: CustomId = {
  name: "register",
  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const fields = interaction.fields.fields;
    const username = fields.get("username").value;
    const email = fields.get("email").value;

    const glimpseApi = new MockGlimpseApi();

    console.log(username, email);

    try {
      const user = await glimpseApi.registerUser(interaction.user.id, username, email);
      const userData = user.getData();
    } catch (e) {
      interaction.editReply({ content: `${e}` });
    }

    // { id: 74n, username: 'aaa', mail: 'a', discord: '283754983415873536' }
    
  }
}
