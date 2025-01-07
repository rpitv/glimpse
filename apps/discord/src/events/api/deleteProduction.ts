import { Production} from "../../api/types";
import {ChannelType, Client, ForumChannel, TextChannel} from "discord.js";
import { config } from "dotenv";
import { GlimpseApiInterface } from "../../api/GlimpseApiInterface";
import { ProductionDiscordData } from "../../types";
import {getDiscordDataFromProduction} from "../../util";

config();
/*
* Needs further testing
*/
export const deleteProduction = {
  name: "deleteProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    if (!production.useDiscord) return;

    const discordData = getDiscordDataFromProduction(production)
    const threadChannel = await client.channels.fetch(discordData.threadChannelId);
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID);

    if(!threadChannel || threadChannel.type !== ChannelType.PublicThread) {
      throw new Error(`Discord data value threadChannelId ${discordData.threadChannelId} does not correspond to a found Discord Public Thread.`)
    }
    if(!volunteerChannel || volunteerChannel.type !== ChannelType.GuildText) {
      throw new Error('Environment variable "VOLUNTEER_CHANNEL_ID" does not correspond to a found Discord Text channel.')
    }

    const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);

    await threadChannel.delete("Production deleted");
    await volunteerMessage?.delete();
  }
}
