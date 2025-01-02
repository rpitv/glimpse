import { Production} from "../../api/types";
import { Client, ForumChannel, TextChannel } from "discord.js";
import { config } from "dotenv";
import { GlimpseApiInterface } from "../../api/GlimpseApiInterface";
import { ProductionDiscordData } from "../../types";

config();
/* 
* Needs further testing
*/
export const deleteProduction = {
  name: "deleteProduction",
  async execute(production: Production, client: Client, api: GlimpseApiInterface) {
    if (!production.useDiscord) return;
    
    const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
    const threadChannel = await client.channels.fetch(discordData.threadChannelId) as ForumChannel;
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
    const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);

    await threadChannel.delete("Production deleted");
    await volunteerMessage.delete();
  }
}