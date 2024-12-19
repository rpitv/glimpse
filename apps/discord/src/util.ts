import { Moment } from "moment";
import { Production } from "./api/types";
import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, channelMention, EmbedBuilder, MessageCreateOptions, MessageEditOptions, messageLink } from "discord.js";


export const dateFormat = "MMMM Do YYYY hh:mm A";

export function formatChannelName(eventName: string, startTime: Moment): string {
    if(eventName.match(/ vs\.? /)) {
        const [home, away] = eventName.split(/ vs\.? /, 2);
        let sport = "";
        if(home.includes("Women")) {
            sport += "w";
        }
        sport += home.split(" ").reverse()[0].toLowerCase();
        return `${startTime.format("YYYY-MM-DD")}-${sport}-${away.toLowerCase().split(" ")[0]}`;
    } else {
        return `${startTime.format("YYYY-MM-DD")}-${eventName.toLowerCase().replace(/ /g, '_')}`;
    }
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

export function createVolunteerEmbed(production: Production, threadChannelId: string): MessageCreateOptions {
  let closetTime = production.closetTime;
  let startTime = production.startTime || production.endTime || production.closetTime;
  let endTime = production.endTime || production.startTime || production.closetTime;

  const fields: APIEmbedField[] = [
    {
      name: "Start",
      value: `<t:${Math.floor(startTime.valueOf() / 1000)}:R>`,
      inline: false
    },
    {
      name: "End",
      value: `<t:${Math.floor(endTime.valueOf() / 1000)}:R>`,
      inline: false
    },
    {
      name: "Link To Channel",
      value: `${channelMention(threadChannelId)}`,
      inline: false
    },
    {
      name: "Volunteers",
      value: "(0) 🦗",
      inline: false
    },
  ];
  if (closetTime)
    fields.unshift({
      name: "Closet",
      value: `<t:${Math.floor(closetTime.getTime() / 1000)}:R>`,
      inline: false
    });

  const embed = new EmbedBuilder().setTitle(`${production.name}`).setColor("#d6001c")
  .addFields(...fields);
  if (production.description && production.description?.trim() !== "")
    embed.setDescription(`${production.description}`);
  
  const volunteer = new ButtonBuilder()
    .setCustomId("volunteer")
    .setLabel("Volunteer")
    .setStyle(ButtonStyle.Success)
  const volunteerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(volunteer);
  return { content: "", embeds: [embed], components: [volunteerRow] };
}

export function createUnvolunteerEmbed(production: Production, volunteerChannelId: string, volunteerMessageId: string): MessageEditOptions {
  let closetTime = production.closetTime;
  let startTime = production.startTime || production.endTime || production.closetTime;
  let endTime = production.endTime || production.startTime || production.closetTime;

  const fields: APIEmbedField[] = [
    {
      name: "Start",
      value: `<t:${Math.floor(startTime.valueOf() / 1000)}>`,
      inline: false
    },
    {
      name: "End",
      value: `<t:${Math.floor(endTime.valueOf() / 1000)}>`,
      inline: false
    },
    {
      name: "Link To Volunteer",
      value: `${messageLink(volunteerChannelId, volunteerMessageId)}`,
      inline: false
    },
    {
      name: "Volunteers",
      value: "(0) 🦗",
      inline: false
    },
  ];
  if (closetTime)
    fields.unshift({
      name: "Closet",
      value: `<t:${Math.floor(closetTime.getTime() / 1000)}>`,
      inline: false
    });
  

  const embed = new EmbedBuilder().setTitle(`${production.name}`).setColor("#d6001c")
    .addFields(...fields);

  if (production.description && production.description?.trim() !== "")
    embed.setDescription(`${production.description}`);
    
  const unvolunteer = new ButtonBuilder()
    .setCustomId("unvolunteer")
    .setLabel("Unvolunteer")
    .setStyle(ButtonStyle.Danger);
  const unvolunteerRow = new ActionRowBuilder<ButtonBuilder>().addComponents(unvolunteer);

  return { content: "", embeds: [embed], components: [unvolunteerRow] };
}