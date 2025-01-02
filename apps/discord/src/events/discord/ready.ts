import { DiscordEvent, ProductionDiscordData } from "../../types";
import {
  ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonComponentData,
    Client,
    Events,
    ForumChannel,
    TextChannel,
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
        if (!discordData) {
          await createProduction.execute(production, client, glimpseApi);
          continue;
        }
        const threadChannel = await client.channels.fetch(discordData.threadChannelId) as ThreadChannel;
        // Make sure any active productions are not archived.
        if (threadChannel.archived)
          threadChannel.setArchived(false);
      }

      // Let's also lock all the threads that are not locked.
      const guild = await client.guilds.fetch(process.env.GUILD_ID!);
      const forumChannel = await guild.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as ForumChannel;
      const archivedThreads = (await forumChannel.threads.fetchArchived()).threads;

      // https://github.com/discord/discord-api-docs/issues/6928#issuecomment-2159320589
      // This can be done as an admin so what the fuck.
      for (const [id, channel] of archivedThreads) {
        if (channel.locked) continue;
        const threadMessage = await channel.fetchStarterMessage();
        const volunteerButtons = threadMessage.components[0].components;
        const disabledVolunteerRow = new ActionRowBuilder<ButtonBuilder>();
        for (const button of volunteerButtons as Partial<ButtonComponentData>[]) {
          const buttonBuilder = new ButtonBuilder(button);
          disabledVolunteerRow.addComponents(buttonBuilder.setDisabled(true));
        }

        const productionId = BigInt(threadMessage.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
        const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
        const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
        const volunteerChannel = (await client.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID)) as TextChannel;
        const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);
        const unvolunteerButtons = volunteerMessage.components[0].components;
        const disabledUnvolunteerRow = new ActionRowBuilder<ButtonBuilder>();
        for (const button of unvolunteerButtons as Partial<ButtonComponentData>[]) {
          const buttonBuilder = new ButtonBuilder(button);
          disabledUnvolunteerRow.addComponents(buttonBuilder.setDisabled(true));
        }
        
        await threadMessage.edit({ components: [disabledVolunteerRow] });
        await volunteerMessage.edit({ components: [disabledUnvolunteerRow] });

        await channel.setArchived(false);
        await channel.setLocked(true);
        await channel.setArchived(true);
      }

    } catch(e) {
      console.log(e);
    }
  }
}