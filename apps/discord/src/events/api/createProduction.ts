import { Production} from "../../api/types";
import { Client, ForumChannel, TextChannel } from "discord.js";
import { config } from "dotenv";
import { GlimpseApiInterface } from "../../api/GlimpseApiInterface";
import { createUnvolunteerEmbed, createVolunteerEmbed } from "../../util";
import { MockGlimpseApi } from "../../api/MockGlimpseApi";


config();

export const createProduction = {
  name: "createProduction",
  async execute(production: Production, client: Client, api: MockGlimpseApi) {
    console.log("New production created:", production);

    const productionForum = await client.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as ForumChannel;
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;

    const threadChannel = await productionForum.threads.create({
      name: `${production.name}`,
      message: {
        content: `If you see this message, it means that u are noob.`
      },
      appliedTags: production.tags,
      
    });

    const volunteerMessage = await volunteerChannel.send(createVolunteerEmbed(production, threadChannel.id));

    const threadMessage = await threadChannel.fetchStarterMessage();
    await threadMessage.edit(createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessage.id));
    await api.setProductionDiscordData(production.id, {
      threadChannelId: threadChannel.id,
      volunteerMessageId: volunteerMessage.id
    });

    return { threadChannelId: threadChannel.id, volunteerMessageId: volunteerMessage.id };

  }
}