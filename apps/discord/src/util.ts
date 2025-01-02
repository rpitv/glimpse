import { Moment } from "moment";
import { Production, ProductionRSVP } from "./api/types";
import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, channelMention, Embed, EmbedBuilder, ForumChannel, MessageCreateOptions, MessageEditOptions, messageLink, userMention } from "discord.js";
import {GlimpseApi} from "./api/GlimpseApi";
import { config } from "dotenv";


export const dateFormat = "MMMM Do YYYY hh:mm A";

export function formatChannelName(eventName: string, startTime: Moment): string {
  return `${startTime.format("YYYY-MM-DD")} ${eventName}`;
}

export function ellipsis(maxLength: number, text: string): string {
    if(text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    }
    return text;
}

export function errorString(message: string, e) {
  return `${message}\n\`\`\`${e}\`\`\``
}

export async function createVolunteerEmbed(production: Production, threadChannelId: string): Promise<MessageCreateOptions | MessageEditOptions> {
  let closetTime = production.closetTime;
  let startTime = production.startTime || production.endTime || production.closetTime;
  let endTime = production.endTime || production.startTime || production.closetTime;

  const fields: APIEmbedField[] = [
    {
      name: "Event Start",
      value: `__Time__\n<t:${Math.floor(new Date(startTime).valueOf() / 1000)}:F>\n__Location__\n${production.eventLocation}`,
      inline: true
    },
    {
      name: "Event End",
      value: `__Time__\n<t:${Math.floor(new Date(endTime).valueOf() / 1000)}:F>`,
      inline: true
    },
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
      value: `${production.teamNotes.length === 0 ? "*No notes have been added*" : production.teamNotes}`,
    },
    {
      name: "~~------------~~ Volunteer List ~~-------------~~",
      value: `${(await updateVolunteers(production.rsvps)).volunteers}`,
      inline: false
    },
  ];
  if (closetTime)
    fields.unshift({
      name: "Closet",
      value: `__Time__\n<t:${Math.floor(new Date(closetTime).valueOf() / 1000)}:F>\n__Location__\n${production.closetLocation}`,
      inline: true
    });
  fields.unshift({
    name: "~~-----------~~ Event Information ~~----------~~",
    value: "\u200b",
    inline: false
  });

  // TODO: REPLACE URL WITH ACTUAL URL
  const embed = new EmbedBuilder().setTitle(`${production.name}`).setURL(`http://localhost:5173/productions/${production.id}`).setColor("#d6001c").setFooter({ text: `Production ID: ${production.id}`})
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

  const fields: APIEmbedField[] = [
    {
      name: "Event Start",
      value: `__Time__\n<t:${Math.floor(new Date(startTime).valueOf() / 1000)}:F>\n__Location__\n${production.eventLocation}`,
      inline: true
    },
    {
      name: "Event End",
      value: `__Time__\n<t:${Math.floor(new Date(endTime).valueOf() / 1000)}:F>`,
      inline: true
    },
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
      value: `${production.teamNotes.length === 0 ? "*No notes have been added*" : production.teamNotes}`,
    },
    {
      name: "~~-------------~~ Volunteer List ~~-------------~~",
      value: `${(await updateVolunteers(production.rsvps)).volunteers}`,
      inline: false
    },
    // Volunteer Notes
    {
      name: "\u200b",
      value: "\u200b",
    }
  ];
  if (closetTime)
    fields.unshift({
      name: "Closet",
      value: `__Time__\n<t:${Math.floor(new Date(closetTime).valueOf() / 1000)}:F>\n__Location__\n${production.closetLocation}`,
      inline: true
    });
  fields.unshift({
    name: "~~-----------~~ Event Information ~~-----------~~",
    value: "\u200b",
    inline: false
  });

  const embed = new EmbedBuilder().setTitle(`${production.name}`).setURL(`http://localhost:5173/productions/${production.id}`).setColor("#d6001c").setFooter({ text: `Production ID: ${production.id}`})
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
      const user = (await glimpseApi.getUserFromUserId(rsvp.userId)).getData();
      if (user.discord) {
        volunteers += `${userMention(user.discord)}\n`;
        if (rsvp.notes) {
          notes++;
          volunteerNotes += `${userMention(user.discord)}\n`;
        }
      }
      // Some users may not have discord
      else {
        volunteers += `\`${user.username}\`\n`;
        if (rsvp.notes) {
          notes++;
          volunteerNotes += `\`${user.username}\`\n`;
        }
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

export async function addForumTag(forumChannel: ForumChannel, category: string) {
  const availableTags = forumChannel.availableTags;
  if (!availableTags.find((tag) => tag.name === category)) {
    await forumChannel.setAvailableTags([...availableTags, { name: category }]);
  }
}

config();

export const glimpseApi = new GlimpseApi();