import { Production} from "../../api";
import { Client, MessageCreateOptions, ChannelType } from "discord.js";
import { config } from "dotenv";
import { getOrCreateForumTag, createUnvolunteerEmbed, createVolunteerEmbed, formatChannelName } from "../../util";
import { GlimpseApiInterface } from "../../api";
import moment from "moment";


config();

export const createProduction = {
  name: "createProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    if (!production.useDiscord) return;

    const productionForum = await client.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID);
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID);

    if(!productionForum || productionForum.type !== ChannelType.GuildForum) {
      throw new Error('Environment variable "PRODUCTIONS_CHANNEL_ID" does not correspond to a found Discord Forum channel.')
    }
    if(!volunteerChannel || volunteerChannel.type !== ChannelType.GuildText) {
      throw new Error('Environment variable "VOLUNTEER_CHANNEL_ID" does not correspond to a found Discord Text channel.')
    }

    let startTime = production.startTime || production.endTime || production.closetTime;
    // It doesn't return a Date, but a string. Welcome to typescript hell
    let startTime = (production.startTime || production.endTime || production.closetTime)?.toString() as string;
    // Adds the category to the list of tags if it doesn't exist.
    let discordTag: string[] = [];
    if (production.category) {
      const tag = await getOrCreateForumTag(productionForum, production.category);
      discordTag.push(tag.id);
    }
    const threadChannel = await productionForum.threads.create({
      name: `${formatChannelName(production.name, moment(startTime).utcOffset(-5))}`,
      message: {
        content: `<@${process.env.RPITV_ID}>`
      },
      appliedTags: discordTag
    });


    const volunteerMessage = await volunteerChannel.send(await createVolunteerEmbed(production, threadChannel.id) as MessageCreateOptions);
    const threadMessage = await threadChannel.fetchStarterMessage();

    if(threadMessage) {
      await threadMessage.edit(await createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessage.id));
    } else {
      console.warn(`Missing thread starter message for thread ${threadChannel.id}. Skipping edit.`)
    }

    await api.setProductionDiscordData(production.id, {
      threadChannelId: threadChannel.id,
      volunteerMessageId: volunteerMessage.id
    });

    return { threadChannelId: threadChannel.id, volunteerMessageId: volunteerMessage.id };
  }
}
