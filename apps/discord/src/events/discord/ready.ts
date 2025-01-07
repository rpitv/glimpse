import { DiscordEvent, ProductionDiscordData } from "../../types";
import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonComponentData, ChannelType,
    Client,
    Events,
    ForumChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";
import { createProduction } from "../api/createProduction";
import {getDiscordDataFromProduction, getProductionFromMessageFooter, glimpseApi} from "../../util";


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
        const discordData = getDiscordDataFromProduction(production)
        if (!discordData) {
          await createProduction.execute(production, client, glimpseApi);
          continue;
        }
        const threadChannel = await client.channels.fetch(discordData.threadChannelId);
        if(!threadChannel || threadChannel.type !== ChannelType.PublicThread) {
          throw new Error(`Discord data value threadChannelId ${discordData.threadChannelId} does not correspond to a found Discord Public Thread.`)
        }
        // Make sure any active productions are not archived.
        if (threadChannel.archived)
          threadChannel.setArchived(false);
      }

      // Let's also lock all the threads that are not locked.
      const guild = await client.guilds.fetch(process.env.GUILD_ID!);
      const forumChannel = await guild.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID);
      if(!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
        throw new Error('Environment variable "PRODUCTIONS_CHANNEL_ID" does not correspond to a found Discord Forum channel.')
      }
      const archivedThreads = (await forumChannel.threads.fetchArchived()).threads;

      // https://github.com/discord/discord-api-docs/issues/6928#issuecomment-2159320589
      // This can be done as an admin so what the heck.
      for (const [id, channel] of archivedThreads) {
        if (channel.locked) continue;
        const threadMessage = await channel.fetchStarterMessage();
        if(threadMessage) {
          const volunteerButtons = threadMessage.components[0].components;
          const disabledVolunteerRow = new ActionRowBuilder<ButtonBuilder>();
          for (const button of volunteerButtons as Partial<ButtonComponentData>[]) {
            const buttonBuilder = new ButtonBuilder(button);
            disabledVolunteerRow.addComponents(buttonBuilder.setDisabled(true));
          }

          const production = await getProductionFromMessageFooter(threadMessage)
          const discordData = getDiscordDataFromProduction(production);
          const volunteerChannel = (await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID));
          if(!volunteerChannel || volunteerChannel.type !== ChannelType.GuildText) {
            throw new Error('Environment variable "VOLUNTEER_CHANNEL_ID" does not correspond to a found Discord Text channel.')
          }
          const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);
          const unvolunteerButtons = volunteerMessage.components[0].components;
          const disabledUnvolunteerRow = new ActionRowBuilder<ButtonBuilder>();
          for (const button of unvolunteerButtons as Partial<ButtonComponentData>[]) {
            const buttonBuilder = new ButtonBuilder(button);
            disabledUnvolunteerRow.addComponents(buttonBuilder.setDisabled(true));
          }

          await threadMessage.edit({ components: [disabledVolunteerRow] });
          await volunteerMessage.edit({ components: [disabledUnvolunteerRow] });
        } else {
          console.warn(`Missing thread starter message for thread ${channel.id}. Unable to disable volunteer buttons or determine source production.`)
        }

        await channel.setArchived(false);
        await channel.setLocked(true);
        await channel.setArchived(true);
      }

    } catch(e) {
      console.log(e);
    }
  }
}
