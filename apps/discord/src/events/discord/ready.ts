import { DiscordEvent, ProductionDiscordData } from "../../types";
import {
    ActivityType,
    Client,
    Events,
    ForumChannel,
    ThreadChannel,
} from "discord.js";
import { createProduction } from "../api/createProduction";
import { glimpseApi } from "../../util";


export const ready: DiscordEvent = {
  name: Events.ClientReady,
  async execute(client: Client) {
    try {
      console.log(`Ready!, Logged in as ${client.user?.tag}`);
      client.user?.setActivity({
        name: "Tetris",
        type: ActivityType.Playing
      }); 
      // Get any productions that did not have discord channels created for.
      const productions = await glimpseApi.getLatestProductions();
      for (const production of productions.getData()) {
        if (!production.discordData) {
          await createProduction.execute(production, client, glimpseApi);
          continue;
        }
        const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
        const threadChannel = await client.channels.fetch(discordData.threadChannelId) as ThreadChannel;
        // Make sure any active productions are not archived.
        if (threadChannel.archived)
          threadChannel.setArchived(false);
      }

      // Let's also lock all the threads that are not locked.
      const guild = await client.guilds.fetch(process.env.GUILD_ID!);
      const forumChannel = await guild.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as ForumChannel;
      const nonLockedThreads = (await forumChannel.threads.fetchArchived()).threads.filter(channel => !channel.locked);

      // https://github.com/discord/discord-api-docs/issues/6928#issuecomment-2159320589
      // This can be done as an admin so what the fuck.
      for (const [id, channel] of nonLockedThreads) {
        await channel.setArchived(false);
        await channel.setLocked(true);
        await channel.setArchived(true);
      }

    } catch(e) {
      console.log(e);
    }
  }
}