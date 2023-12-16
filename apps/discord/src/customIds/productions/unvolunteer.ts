import {CustomId} from "../../types";
import {ButtonInteraction} from "discord.js";
import {sendRPC} from "../../amqp";


export const unvolunteer: CustomId = {
    name: "unvolunteer",
    async execute(interaction: ButtonInteraction) {
        // Retrieve this channel's production by finding the first production that has this Discord channel, server, and message IDs
        const currentProduction = (await sendRPC<any[]>("findManyProduction", { filter:
                {
                    discordChannel: {equals: interaction.channelId },
                    discordServer: {equals: interaction.guildId },
                    discordUnvolunteerMessage: {equals: interaction.message.id}
                },
            pagination: { take: 1 }
        }))[0];
        //
        // if (!currentProduction) {
        //     /*
        //         To update users, we have to copy the data, delete the data, update the data, and place the data.
        //         Because of this, simultaneous button presses cannot occur or they will cause an error.
        //     */
        //     interaction.reply({
        //         content: 'The bot cannot handle multiple button presses at once, please click again shortly',
        //         ephemeral: true
        //     })
        //     return;
        // }
        // if (!currentProduction.volunteers.find((volunteer: string) => volunteer === interaction.user.id)) {
        //     await interaction.reply({
        //         content: 'YO U WANNA NOT?',
        //         ephemeral: true
        //     })
        //     return;
        // }
        // await productionsRef.update({
        //     productions: FieldValue.arrayRemove(currentProduction)
        // }).catch(() => interaction.reply({ content: 'Could not update user', ephemeral: true}));
        // const index = currentProduction.volunteers.indexOf(interaction.user.id);
        // currentProduction.volunteers.splice(index, 1);
        // await productionsRef.update({
        //     productions: FieldValue.arrayUnion(currentProduction)
        // }).catch(() => interaction.reply({ content: 'Could not update user', ephemeral: true}));
        // const volChl = await interaction.guild?.channels.fetch(proChannel) as BaseGuildTextChannel;
        // const volunteerMsg = await volChl.messages.fetch(currentProduction.volunteerMsgId);
        //
        // let volunteers = `(${currentProduction.volunteers.length}) `;
        // for (let i = 0; i < currentProduction.volunteers.length; i++)
        //     volunteers += `<@${currentProduction.volunteers[i]}> `;
        // const field = volunteerMsg.embeds[0].fields
        // if (currentProduction.volunteers.length === 0)
        //     volunteers = '(0) 🦗';
        // field[4] = {
        //     name: 'Volunteers',
        //     value: volunteers
        // }
        // const unVolCh = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
        // const unVolunteerMsg = await unVolCh.messages.fetch(currentProduction.unVolunteerMsgId);
        //
        // let updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
        // await volunteerMsg.edit({embeds: [updatedProduction]});
        // await unVolunteerMsg.edit({embeds: [updatedProduction]});
        // const currProChannel = await interaction.guild?.channels.fetch(currentProduction.channelId) as BaseGuildTextChannel;
        // await currProChannel.permissionOverwrites.delete(interaction.user.id);
        // await interaction.reply(`${userMention(interaction.user.id)} has unvolunteered this production!`);

        await interaction.reply({ephemeral: true, content: "This feature is not yet implemented"});
    }
}
