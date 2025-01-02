import { Production} from "../../api/types";
import { Client, ForumChannel, GuildForumTag, MessageCreateOptions, TextChannel } from "discord.js";
import { config } from "dotenv";
import { addForumTag, createUnvolunteerEmbed, createVolunteerEmbed, formatChannelName } from "../../util";
import { GlimpseApiInterface } from "../../api/GlimpseApiInterface";
import moment from "moment";


config();

export const createProduction = {
  name: "createProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    if (!production.useDiscord) return;

    const productionForum = await client.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as ForumChannel;
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;

    let startTime = production.startTime || production.endTime || production.closetTime;

    // Adds the category to the list of tags if it doesn't exist.
    let discordTag: string[] = [];
    if (production.category) {
      await addForumTag(productionForum, production.category);
      const availableTags = productionForum.availableTags;
      discordTag.push(availableTags.find(tag => tag.name === production.category).id);
    }


    const threadChannel = await productionForum.threads.create({
      name: `${formatChannelName(production.name, moment(startTime))}`,
      message: {
        content: `<@${process.env.RPITV_ID}>`
      },
      appliedTags: discordTag
    });


    const volunteerMessage = await volunteerChannel.send(await createVolunteerEmbed(production, threadChannel.id) as MessageCreateOptions);

    const threadMessage = await threadChannel.fetchStarterMessage();
    await threadMessage.edit(await createUnvolunteerEmbed(production, volunteerChannel.id, volunteerMessage.id));
    await api.setProductionDiscordData(production.id, {
      threadChannelId: threadChannel.id,
      volunteerMessageId: volunteerMessage.id
    });
    
    return { threadChannelId: threadChannel.id, volunteerMessageId: volunteerMessage.id };
  }
}