import { Production} from "../../api";
import {ChannelType, Client, MessageEditOptions} from "discord.js";
import { config } from "dotenv";
import {
    getOrCreateForumTag,
    createUnvolunteerEmbed,
    createVolunteerEmbed,
    formatChannelName,
    getDiscordDataFromProduction
} from "../../util";
import type { GlimpseApiInterface } from "../../api";
import moment from "moment";
import { createProduction } from "./createProduction";

config();

export const updateProduction = {
  name: "updateProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    // TODO delete messages/threads if this was previously set to true
    if (!production.useDiscord) return;

    // Something has previously terribly gone wrong.
    if (!production.discordData) {
      await createProduction.execute(production, client, api);
      return;
    }
    const discordData = getDiscordDataFromProduction(production)
    // Same thing
    if (!production.discordData) {
      await createProduction.execute(production, client, api);
      return;
    }

    // If the production has previously used discord, update the discord stuff.
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID);
    const threadChannel = await client.channels.fetch(discordData.threadChannelId);

    if(!threadChannel || threadChannel.type !== ChannelType.PublicThread) {
      throw new Error(`Discord data value threadChannelId ${discordData.threadChannelId} does not correspond to a found Discord Public Thread.`)
    }
    if(!volunteerChannel || volunteerChannel.type !== ChannelType.GuildText) {
      throw new Error('Environment variable "VOLUNTEER_CHANNEL_ID" does not correspond to a found Discord Text channel.')
    }

    const volunteerMessageId = discordData.volunteerMessageId;

    let startTime = production.startTime || production.endTime || production.closetTime;

    // Adds the category to the list of tags if it doesn't exist.
    let discordTag: string[] = [];

    if (production.category) {
      const productionForum = await client.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID);
      if(!productionForum || productionForum.type !== ChannelType.GuildForum) {
        throw new Error('Environment variable "PRODUCTIONS_CHANNEL_ID" does not correspond to a found Discord Forum channel.')
      }
      const tag = await getOrCreateForumTag(productionForum, production.category);
      discordTag.push(tag.id);
    }

    await threadChannel.setName(`${formatChannelName(production.name, moment(startTime))}`);
    await threadChannel.setAppliedTags(discordTag);

    const threadMessage = await threadChannel.fetchStarterMessage();
    if(threadMessage) {
      await threadMessage.edit(await createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessageId));
    } else {
      console.warn(`Missing thread starter message for thread ${threadChannel.id}. Skipping edit.`)
    }

    const volunteerMessage = await volunteerChannel.messages.fetch(volunteerMessageId);
    await volunteerMessage.edit(await createVolunteerEmbed(production, threadChannel.id) as MessageEditOptions);
  }
}
