import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponentData, ChannelType,
    Events,
    ThreadChannel,
} from "discord.js";
import {getDiscordDataFromProduction, getProductionFromMessageFooter, glimpseApi} from "../../util";


export const threadUpdate = {
  name: Events.ThreadUpdate,
  async execute(oldChannel: ThreadChannel, newChannel: ThreadChannel) {
    // If the thread is archived
    if (newChannel.archived && !newChannel.locked) {
      let unarchive = false;
      const productions = await glimpseApi.getLatestProductions().then((productions) => productions.getData());
      // If the production is archived but they're still "active", unarchive the thread. Otherwise, lock it.
      for (const production of productions) {
        const discordData = getDiscordDataFromProduction(production)
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
        if(threadMessage) {
          const volunteerButtons = threadMessage.components[0].components;
          const disabledVolunteerRow = new ActionRowBuilder<ButtonBuilder>();
          for (const button of volunteerButtons as Partial<ButtonComponentData>[]) {
            const buttonBuilder = new ButtonBuilder(button);
            disabledVolunteerRow.addComponents(buttonBuilder.setDisabled(true));
          }
          const production = await getProductionFromMessageFooter(threadMessage);
          const discordData = getDiscordDataFromProduction(production)
          const volunteerChannel = (await newChannel.guild.channels.fetch(process.env.VOLUNTEER_CHANNEL_ID));
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

          await threadMessage.edit({components: [disabledVolunteerRow]});
          await volunteerMessage.edit({components: [disabledUnvolunteerRow]});
        } else {
          console.warn(`Missing thread starter message for thread ${newChannel.id}. Unable to disable volunteer buttons or determine source production.`)
        }
        await newChannel.setArchived(false);
        await newChannel.setLocked(true);
        await newChannel.setArchived(true);
      }
    }
  }
}
