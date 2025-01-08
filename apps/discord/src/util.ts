import { Moment } from "moment";
import {Production, ProductionRSVP} from "./api/types";
import {
    ActionRowBuilder,
    APIEmbedField,
    ButtonBuilder,
    ButtonStyle,
    channelMention,
    EmbedBuilder,
    ForumChannel, GuildForumTag,
    Message,
    MessageCreateOptions,
    MessageEditOptions,
    messageLink, userMention
} from "discord.js";
import {GlimpseApi} from "./api";
import { config } from "dotenv";
import {ProductionDiscordData} from "./types";

export function formatChannelName(eventName: string, startTime: Moment): string {
  return `${startTime.format("YYYY-MM-DD")} ${eventName}`;
}

export function ellipsis(maxLength: number, text: string): string {
    if(text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    }
    return text;
}

export async function createVolunteerEmbed(production: Production, threadChannelId: string): Promise<MessageCreateOptions | MessageEditOptions> {
  let closetTime = production.closetTime;
  let startTime = production.startTime || production.endTime || production.closetTime;
  let endTime = production.endTime || production.startTime || production.closetTime;

  const validRsvps = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");

  const fields: APIEmbedField[] = [
    {
      name: "Thread Channel",
      value: `${channelMention(threadChannelId)}`,
      inline: false
    },
    {
      name: "~~--------~~ Additional Information ~~--------~~",
      value: `\u200b`,
      inline: false
    },
    {
      name: "Team Notes",
      value: `${production.teamNotes ? production.teamNotes :  "*No notes have been added*"}`,
    },
    {
      name: "~~------------~~ Volunteer List ~~-------------~~",
      value: `${(await updateVolunteers(validRsvps)).volunteers}`,
      inline: false
    },
  ];

  if(endTime) {
    fields.unshift({
      name: "Event End",
      value: `__Time__\n<t:${Math.floor(new Date(endTime).valueOf() / 1000)}:F>`,
      inline: true
    })
  }
  if(startTime) {
    fields.unshift({
      name: "Event Start",
      value: `__Time__\n<t:${Math.floor(new Date(startTime).valueOf() / 1000)}:F>\n__Location__\n${production.eventLocation}`,
      inline: true
    })
  }
  if (closetTime) {
    fields.unshift({
      name: "Closet",
      value: `__Time__\n<t:${Math.floor(new Date(closetTime).valueOf() / 1000)}:F>\n__Location__\n${production.closetLocation}`,
      inline: true
    });
  }
  fields.unshift({
    name: "~~-----------~~ Event Information ~~----------~~",
    value: "\u200b",
    inline: false
  });

  const embed = new EmbedBuilder().setTitle(`${production.name}`).setURL(`${process.env.WEB_URL}/productions/${production.id}`).setColor("#d6001c").setFooter({ text: `Production ID: ${production.id}`})
    .addFields(...fields);
  if (production.description && production.description?.trim() !== "")
    embed.setDescription(`${ellipsis(50, production.description)}`);

  const volunteer = new ButtonBuilder()
    .setCustomId("volunteer")
    .setLabel("Volunteer")
    .setStyle(ButtonStyle.Success)
  const volunteerWithNotes = new ButtonBuilder()
    .setCustomId("volunteerWithNotes")
    .setLabel("Volunteer with Notes")
    .setStyle(ButtonStyle.Primary);
  const volunteerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(volunteer, volunteerWithNotes);
  return { content: "", embeds: [embed], components: [volunteerRow] };
}

export async function createUnvolunteerEmbed(production: Production, volunteerChannelId: string, volunteerMessageId: string): Promise<MessageEditOptions> {
  let closetTime = production.closetTime;
  let startTime = production.startTime || production.endTime || production.closetTime;
  let endTime = production.endTime || production.startTime || production.closetTime;

  const validRsvps = production.rsvps.filter((rsvp) => rsvp.willAttend === "yes");

  const fields: APIEmbedField[] = [
    {
      name: "Volunteer Here",
      value: `${messageLink(volunteerChannelId, volunteerMessageId)}`,
      inline: false
    },
    {
      name: "~~--------~~ Additional Information ~~--------~~",
      value: `\u200b`,
      inline: false
    },
    {
      name: "Team Notes",
      value: `${production.teamNotes ? production.teamNotes :  "*No notes have been added*"}`,
    },
    {
      name: "~~-------------~~ Volunteer List ~~-------------~~",
      value: `${(await updateVolunteers(validRsvps)).volunteers}`,
      inline: false
    },
    // Volunteer Notes
    {
      name: "\u200b",
      value: "\u200b",
    }
  ];
  if(endTime) {
    fields.unshift({
      name: "Event End",
      value: `__Time__\n<t:${Math.floor(new Date(endTime).valueOf() / 1000)}:F>`,
      inline: true
    })
  }
  if(startTime) {
    fields.unshift({
      name: "Event Start",
      value: `__Time__\n<t:${Math.floor(new Date(startTime).valueOf() / 1000)}:F>\n__Location__\n${production.eventLocation}`,
      inline: true
    })
  }
  if (closetTime) {
    fields.unshift({
      name: "Closet",
      value: `__Time__\n<t:${Math.floor(new Date(closetTime).valueOf() / 1000)}:F>\n__Location__\n${production.closetLocation}`,
      inline: true
    });
  }
  fields.unshift({
    name: "~~-----------~~ Event Information ~~-----------~~",
    value: "\u200b",
    inline: false
  });

  const embed = new EmbedBuilder().setTitle(`${production.name}`).setURL(`${process.env.WEB_URL}/productions/${production.id}`).setColor("#d6001c").setFooter({ text: `Production ID: ${production.id}`})
    .addFields(...fields);
  if (production.description && production.description?.trim() !== "")
    embed.setDescription(`${ellipsis(50, production.description)}`);

  const unvolunteer = new ButtonBuilder()
    .setCustomId("unvolunteer")
    .setLabel("Unvolunteer")
    .setStyle(ButtonStyle.Danger);
  const volunteerNotes = new ButtonBuilder()
    .setCustomId("getVolunteerNotes")
    .setLabel("Get Volunteer Notes")
    .setStyle(ButtonStyle.Primary);
  const unvolunteerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(unvolunteer, volunteerNotes);

  return { content: "", embeds: [embed], components: [unvolunteerRow] };
}

export async function updateVolunteers(rsvps: ProductionRSVP[]) {
  let volunteers = ``;
  let volunteerNotes = ``;
  let notes = 0;
  if (rsvps.length === 0) {
    volunteers = `*No one has volunteered yet*`;
  } else {
  for (const rsvp of rsvps) {
      if (rsvp.willAttend === "no") continue;
      const userDisplayName = await getDiscordUserDisplayName(rsvp.userId);
      volunteers += `${userDisplayName}\n`;
      if (rsvp.notes) {
        notes++;
        volunteerNotes += `${userDisplayName}\n`;
      }

    }
    volunteers = `***${rsvps.length} Volunteer${rsvps.length === 1 ? "" : "s"}***\n` + volunteers;
    if (notes > 0)
      volunteerNotes = `***${notes} Volunteer${notes === 1 ? "" : "s"} with Notes***\n` + volunteerNotes;
    else
      volunteerNotes = "\u200b";
  }
  return { volunteers: volunteers, volunteerNotes: volunteerNotes };
}

export async function getOrCreateForumTag(forumChannel: ForumChannel, category: string): Promise<GuildForumTag> {
  const availableTags = forumChannel.availableTags;
  const trimmedCategoryName = category.substring(0, 20)
  if (!availableTags.find((tag) => tag.name === trimmedCategoryName)) {
    await forumChannel.setAvailableTags([...availableTags, { name: trimmedCategoryName }]);
  }
  const foundTag = forumChannel.availableTags.find((tag) => tag.name === trimmedCategoryName);
  if (!foundTag) {
      throw new Error(`Failed to create tag "${category} for channel ${forumChannel.id}`)
  }
  return foundTag;
}

export async function getDiscordUserDisplayName(userId: bigint): Promise<string> {
  const user = await glimpseApi.getUserFromUserId(userId).then((data) => data.getData());
  if(!user) {
    return `<Unknown User ${userId}>`
  }
  if(!user.discord) {
    return user.username;
  }
  return userMention(user.discord)

}

export async function getProductionFromMessageFooter(message: Message): Promise<Production> {
  const productionIdText = message.embeds?.[0]?.data.footer?.text?.match(/Production ID: (\d+)/)?.[1]
  if(!productionIdText) {
    throw new Error(`Unable to retrieve production ID from footer of ${message.id}`)
  }
  const productionId = BigInt(productionIdText);
  const production = await glimpseApi.getProductionData(productionId).then((data) => data.getData());
  if(!production) {
    throw new Error(`Production with ID no longer exists; retrieved from footer of ${message.id}`)
  }
  return production;
}

export function getDiscordDataFromProduction(production: Production): ProductionDiscordData {
  if(!production.discordData) {
    throw new Error(`Missing Discord data in Production ${production.id}`);
  }
  const parsedData = JSON.parse(production.discordData.toString()).data
  if(!parsedData.threadChannelId || typeof parsedData.threadChannelId !== 'string') {
    throw new Error(`Missing or malformed threadChannelId in Discord data for Production ${production.id}`)
  }
  if(!parsedData.volunteerMessageId || typeof parsedData.volunteerMessageId !== 'string') {
    throw new Error(`Missing or malformed volunteerMessageId in Discord data for Production ${production.id}`)
  }
  return parsedData;
}

config();

export const glimpseApi = new GlimpseApi();
