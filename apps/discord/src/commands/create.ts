import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder } from "discord.js";
import { Command } from "../types";
import { glimpseApi } from "../util";

export const create: Command = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Mimics the create event for the api. Will be removed in production"),
  async execute(interaction) {
    glimpseApi.emit("createProduction", {
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
      tags: ["1316667831303147540"],
      teamNotes: "Testing"
    });
    await interaction.reply("Production created");
  }
}