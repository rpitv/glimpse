import { Production} from "../../api/types";
import { Client, ForumChannel, MessageEditOptions, TextChannel, ThreadChannel } from "discord.js";
import { config } from "dotenv";
import { createUnvolunteerEmbed, createVolunteerEmbed } from "../../util";
import { MockGlimpseApi } from "../../api/MockGlimpseApi";


config();

export const updateProduction = {
  name: "updateProduction",
  async execute(production: Production, client: Client, api: MockGlimpseApi) {
    if (!production.useDiscord) return;

    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
    const threadChannel = await client.channels.fetch(production.discordData.threadChannelId) as ThreadChannel;
    const volunteerMessageId = production.discordData.volunteerMessageId;

    await threadChannel.edit({
      name: `${production.name}`,
      appliedTags: production.tags,
    })
    
    const threadMessage = await threadChannel.fetchStarterMessage();
    await threadMessage.edit(createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessageId));

    const volunteerMessage = await volunteerChannel.messages.fetch(volunteerMessageId);
    await volunteerMessage.edit(createVolunteerEmbed(production, threadChannel.id) as MessageEditOptions);

  }
}