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
    console.log("Production deleted:", production);
    
    const productionData = production.discordData as ProductionDiscordData;
    const threadChannel = await client.channels.fetch(productionData.threadChannelId) as ForumChannel;
    const volunteerMessage = await client.channels.fetch(productionData.volunteerMessageId) as TextChannel;

    await threadChannel.delete("Production deleted");
    await volunteerMessage.delete("Production deleted");
  }
}