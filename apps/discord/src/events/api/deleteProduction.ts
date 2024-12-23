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
    
    const productionData = production.discordData as ProductionDiscordData;
    const threadChannel = await client.channels.fetch(productionData.threadChannelId) as ForumChannel;
    const volunteerChannel = await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID) as TextChannel;
    const volunteerMessage = await volunteerChannel.messages.fetch(productionData.volunteerMessageId);

    await threadChannel.delete("Production deleted");
    await volunteerMessage.delete();
  }
}