import {CustomId} from "../../types";
import {BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, userMention} from "discord.js";
import {db} from "../../db";
import {eq} from "drizzle-orm";
import {volunteers, users} from "../../schema";
import {errorString} from "../../util";


export const unvolunteer: CustomId = {
    name: "unvolunteer",
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply({ ephemeral: true });
        // Retrieve this channel's production by finding the first production that has this Discord channel, server, and message IDs
        // const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
        //         {
        //             discordChannel: {equals: interaction.channelId },
        //             discordServer: {equals: interaction.guildId },
        //             discordUnvolunteerMessage: {equals: interaction.message.id}
        //         },
        //     pagination: { take: 1 }
        // }))[0];
        try {
            const currentProduction = await db.query.productions.findFirst({
                where: (production, {eq}) => eq(production.channelId, interaction.channelId),
            });
            const currentVolunteers = await db.query.volunteers.findMany({
                where: (volunteer, {eq}) => eq(volunteer.channelId, interaction.channelId)
            });

            if (!currentProduction) {
                await interaction.editReply({
                    content: "This production doesn't exist...",
                })
                return;
            }

            if (!currentVolunteers.find((volunteer) => volunteer.userId === interaction.user.id)) {
                await interaction.editReply({
                    content: 'YO U WANNA NOT?',
                });
                return;
            }

            currentVolunteers.splice(currentVolunteers.indexOf(currentVolunteers.find((volunteer) => volunteer.userId === interaction.user.id)), 1);

            await db.delete(volunteers).where(eq(volunteers.userId, interaction.user.id));

            // await db.update(productions).set({
            //   volunteers: currentProduction.volunteers
            // }).where(eq(productions.channelId, currentProduction.channelId))
            //   .catch(() => interaction.reply({content: "Could not update user", ephemeral: true}));

            const volChannel = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as BaseGuildTextChannel;
            const volunteerMsg = await volChannel.messages.fetch(currentProduction.volunteerEmbedId);

            let volunteerString = `(${currentVolunteers.length}) `;
            for (let i = 0; i < currentVolunteers.length; i++)
                volunteerString += `<@${currentVolunteers[i].userId}> `;
            const field = volunteerMsg.embeds[0].fields;
            if (currentVolunteers.length === 0)
                volunteerString = '(0) 🦗';
            field[4] = {
                name: 'Volunteers',
                value: volunteerString
            }
            const unVolCh = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
            const unVolunteerMsg = await unVolCh.messages.fetch(currentProduction.unVolunteerEmbedId);

            let updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
            await volunteerMsg.edit({embeds: [updatedProduction]});
            await unVolunteerMsg.edit({embeds: [updatedProduction]});
            const currProChannel = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
            await interaction.editReply({ content: "Successfully Unvolunteered"});
            await currProChannel.permissionOverwrites.delete(interaction.user.id);
            await currProChannel.send(`${userMention(interaction.user.id)} has unvolunteered this production!`);
        } catch(e) {
            await interaction.editReply({
                content: errorString("Failed to unvolunteer", e),
            });
        }
    }
}
