import {CustomId} from "../../types";
import {BaseGuildTextChannel, ButtonInteraction, EmbedBuilder, userMention} from "discord.js";
import {db} from "../../db";
import {productions, volunteers} from "../../schema";
import {eq} from "drizzle-orm";
import {errorString} from "../../util";

export const volunteer: CustomId = {
    name: "volunteer",
    async execute(interaction: ButtonInteraction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            // Retrieve this channel's production by finding the first production that has this Discord channel, server, and message IDs
            const currentProduction = await db.query.productions.findFirst({
                where: (production, {eq}) => eq(production.volunteerEmbedId, interaction.message.id),
            });
            const currentVolunteers = await db.query.volunteers.findMany({
                where: (volunteer, {eq}) => eq(volunteer.channelId, currentProduction.channelId)
            });


            if (!currentProduction) {
                await interaction.editReply({
                    content: "This production doesn\'t exist...",
                })
                return;
            }
            if (currentVolunteers.find((volunteer) => volunteer.userId === interaction.user.id)) {
                await interaction.editReply({
                    content: "You have already applied to volunteer for this event",
                });
                return;
            }


            await db.insert(volunteers).values({
                channelId: currentProduction.channelId,
                userId: interaction.user.id
            }).catch((e) => {
                console.error(e)
                interaction.editReply({content: "Could not add user"});
                return;
            });

            currentVolunteers.push({channelId: currentProduction.channelId, userId: interaction.user.id});
            const volChannel = await interaction.guild?.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as BaseGuildTextChannel;
            const volunteerMsg = await volChannel.messages.fetch(currentProduction.volunteerEmbedId);
            let volunteerString = `(${currentVolunteers.length}) `;
            for (let i = 0; i < currentVolunteers.length; i++)
                volunteerString += `<@${currentVolunteers[i].userId}> `;
            const field = volunteerMsg.embeds[0].fields;
            field[4] = {
                name: "Volunteers",
                value: volunteerString
            }
            const unVolChl = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
            const unVolunteerMsg = await unVolChl.messages.fetch(currentProduction.unVolunteerEmbedId);

            const updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
            await volunteerMsg.edit({embeds: [updatedProduction]});
            await unVolunteerMsg.edit({embeds: [updatedProduction]});

            const currProChannel = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
            await currProChannel.permissionOverwrites.edit(interaction.user.id, {ViewChannel: true});
            await currProChannel.send(`${userMention(interaction.user.id)} has volunteered for this production!`);
            await interaction.editReply({
                content: "Successfully volunteered!",
            });
        } catch(e) {
            await interaction.editReply({
                content: errorString("Failed to volunteer", e),
            })
        }
    }
}
