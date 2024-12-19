import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder } from "discord.js";
import { Command } from "../types";

export const register: Command = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register an account with RPI TV. Fails if you already have one."),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setTitle("Register Account")
      .setCustomId("register");

    const username = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("Set your username, ideally your RCS ID.")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("smithj2")
      .setRequired(true);

    const email = new TextInputBuilder()
      .setCustomId("email")
      .setLabel("Set your email address.")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("smithj2@rpi.edu")
      .setRequired(true);

    const usernameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(username);
    const emailRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(email);

    modal.addComponents(usernameRow, emailRow);

    await interaction.showModal(modal);
  }
}