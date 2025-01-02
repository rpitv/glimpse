import { Production} from "../../api/types";
import { Client, ForumChannel, MessageEditOptions, TextChannel, ThreadChannel } from "discord.js";
import { config } from "dotenv";
import { addForumTag, createUnvolunteerEmbed, createVolunteerEmbed, formatChannelName } from "../../util";
import { GlimpseApiInterface } from "../../api/GlimpseApiInterface";
import moment from "moment";
import { ProductionDiscordData } from "../../types";
import { createProduction } from "./createProduction";

config();

export const updateProduction = {
  name: "updateProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    if (!production.useDiscord) return;

    // Something has previously terribly gone wrong.
    if (!production.discordData) {
      createProduction.execute(production, client, api);
      return;
    }
    const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
    // Same thing
    if (!production.discordData) {
      createProduction.execute(production, client, api);
      return;
    }

    // If the production has previously used discord, update the discord stuff.
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
    const threadChannel = await client.channels.fetch(discordData.threadChannelId) as ThreadChannel;
    const volunteerMessageId = discordData.volunteerMessageId;

    let startTime = production.startTime || production.endTime || production.closetTime;

    // Adds the category to the list of tags if it doesn't exist.
    let discordTag: string[] = [];

    if (production.category) {
      const productionForum = await client.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as ForumChannel;
      await addForumTag(productionForum, production.category);
      const availableTags = productionForum.availableTags;
      discordTag.push(availableTags.find(tag => tag.name === production.category).id);
    }

    await threadChannel.setName(`${formatChannelName(production.name, moment(startTime))}`);
    await threadChannel.setAppliedTags(discordTag);
    
    const threadMessage = await threadChannel.fetchStarterMessage();
    await threadMessage.edit(await createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessageId));

    const volunteerMessage = await volunteerChannel.messages.fetch(volunteerMessageId);
    await volunteerMessage.edit(await createVolunteerEmbed(production, threadChannel.id) as MessageEditOptions);
  }
}