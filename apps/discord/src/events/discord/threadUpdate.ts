import { DiscordEvent, ProductionDiscordData } from "../../types";
import {
  ActivityType,
  Client,
  Events,
  ThreadChannel,
} from "discord.js";
import { createProduction } from "../api/createProduction";
import { glimpseApi } from "../../util";


export const threadUpdate = {
  name: Events.ThreadUpdate,
  async execute(oldChannel: ThreadChannel, newChannel: ThreadChannel) {
    // If the thread is archived
    if (newChannel.archived) {
      let unarchive = false;
      const productions = await glimpseApi.getLatestProductions().then((productions) => productions.getData());
      // If the production is archived but they're still "active", unarchive the thread. Otherwise, lock it.
      for (const production of productions) {
        const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
        if (discordData.threadChannelId === newChannel.id) {
          unarchive = true;
          await newChannel.setArchived(false);
          break;
        }
      }
      
      // Otherwise, lock the thread.
      // https://github.com/discord/discord-api-docs/issues/6928#issuecomment-2159320589
      if (!unarchive) {
        await newChannel.setArchived(false);
        await newChannel.setLocked(true);
        await newChannel.setArchived(true);
      }
    }
  }
}