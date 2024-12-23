import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder } from "discord.js";
import { Command } from "../types";
import { glimpseApi } from "../util";

export const del: Command = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .addStringOption(option => option.setName("message").setDescription("The id of the message to update").setRequired(true))
    .addChannelOption(option => option.setName("channel").setDescription("The channel to update the message in").setRequired(true))
    .setDescription("Mimics the delete event for the api. Will be removed in production"),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const messageId = interaction.options.getString('message');
    glimpseApi.emit("deleteProduction", {
      id: 1n,
      name: "Test Production",
      closetTime: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      useDiscord: true,
      category: "Sports",
      description: "Testing",
      closetLocation: "RPI TV Closet",
      eventLocation: "Houston Field House",
      tags: ["Test"],
      teamNotes: "Testing",
      discordData: {
        threadChannelId: channel.id,
        volunteerMessageId: messageId
      }
    });
    await interaction.reply("Production deleted");
  }
}