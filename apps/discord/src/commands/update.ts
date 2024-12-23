import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder } from "discord.js";
import { Command } from "../types";
import { glimpseApi } from "../util";

export const update: Command = {
  data: new SlashCommandBuilder()
    .setName("update")
    .addStringOption(option => option.setName("message").setDescription("The id of the message to update").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("The channel to update the message in").setRequired(true))
    .setDescription("Mimics the create event for the api. Will be removed in production"),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const messageId = interaction.options.getString('message');

    glimpseApi.emit("updateProduction", {
      id: 1n,
      name: "Updated Production",
      closetTime: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      useDiscord: true,
      category: "Not Sports",
      description: "Updated",
      closetLocation: "RPI TV Office",
      eventLocation: "ECAV",
      tags: [],
      teamNotes: "AAAAAA",
      discordData: {
        threadChannelId: channel.id,
        volunteerMessageId: messageId
      }
    });
    await interaction.reply("Production updated");
  }
}