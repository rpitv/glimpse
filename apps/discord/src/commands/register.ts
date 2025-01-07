import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder } from "discord.js";
import { Command } from "../types";
import {glimpseApi} from "../util";
import {UserError} from "../api";

export const register: Command = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register an account with RPI TV. Fails if you already have one."),
  async execute(interaction) {

    try {
      const existingUser = (await glimpseApi.getUserFromDiscordId(interaction.user.id)).getData();
      if(existingUser) {
        return await interaction.reply({ content: `You already have an account. You can log in with Discord at ${process.env.WEB_URL}/login.`, ephemeral: true });
      }
    } catch(e) {
      if(e instanceof UserError) {
        return await interaction.reply({ content: e.message, ephemeral: true });
      } else {
        console.error(e);
        return await interaction.reply({ content: `There was an error! Contact an officer or developer.`, ephemeral: true });
      }
    }

    const modal = new ModalBuilder()
      .setTitle("Register Account")
      .setCustomId("register");

    const username = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("Set your username, ideally your RCS ID.")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(8)
      .setPlaceholder("smithj2")
      .setRequired(true);

    const email = new TextInputBuilder()
      .setCustomId("email")
      .setLabel("Set your email address.")
      .setMaxLength(300)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("smithj2@rpi.edu")
      .setRequired(true);

    const usernameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(username);
    const emailRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(email);

    modal.addComponents(usernameRow, emailRow);

    return await interaction.showModal(modal);
  }
}
