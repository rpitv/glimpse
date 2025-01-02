import { ProductionDiscordData } from "../../types";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponentData,
  Events,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { glimpseApi } from "../../util";


export const threadUpdate = {
  name: Events.ThreadUpdate,
  async execute(oldChannel: ThreadChannel, newChannel: ThreadChannel) {
    // If the thread is archived
    if (newChannel.archived && !newChannel.locked) {
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
      
      // Lock the thread.
      // https://github.com/discord/discord-api-docs/issues/6928#issuecomment-2159320589
      if (!unarchive) {
        const threadMessage = await newChannel.fetchStarterMessage();
        const volunteerButtons = threadMessage.components[0].components;
        const disabledVolunteerRow = new ActionRowBuilder<ButtonBuilder>();
        for (const button of volunteerButtons as Partial<ButtonComponentData>[]) {
          const buttonBuilder = new ButtonBuilder(button);
          disabledVolunteerRow.addComponents(buttonBuilder.setDisabled(true));
        }

        const productionId = BigInt(threadMessage.embeds[0].data.footer.text.match(/Production ID: (\d+)/)[1]);
        const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
        const discordData = JSON.parse(production.discordData.toString()).data as ProductionDiscordData;
        const volunteerChannel = (await newChannel.guild.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID)) as TextChannel;
        const volunteerMessage = await volunteerChannel.messages.fetch(discordData.volunteerMessageId);
        const unvolunteerButtons = volunteerMessage.components[0].components;
        const disabledUnvolunteerRow = new ActionRowBuilder<ButtonBuilder>();
        for (const button of unvolunteerButtons as Partial<ButtonComponentData>[]) {
          const buttonBuilder = new ButtonBuilder(button);
          disabledUnvolunteerRow.addComponents(buttonBuilder.setDisabled(true));
        }
        
        await threadMessage.edit({ components: [disabledVolunteerRow] });
        await volunteerMessage.edit({ components: [disabledUnvolunteerRow] });
        await newChannel.setArchived(false);
        await newChannel.setLocked(true);
        await newChannel.setArchived(true);
      }
    }
  }
}