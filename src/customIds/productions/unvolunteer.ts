import {CustomId, Production, Setup} from "../../types";
import {db} from "../../firebase";
import {FieldValue} from "firebase-admin/firestore";
import {
    BaseGuildTextChannel,
    ButtonInteraction,
    EmbedBuilder,
    userMention
} from "discord.js";


export const unvolunteer: CustomId = {
    name: "unvolunteer",
    async execute(interaction: ButtonInteraction) {
        const setupRef = await db.collection('rpi-tv').doc('setup').get();
        const { proChannel } = setupRef.data() as Setup;
        const productionsRef = db.collection('rpi-tv').doc('productions');
        await productionsRef.get().then(async (production) => {
            let currentProduction = production.data()?.productions.find((prod: Production) => prod.unVolunteerMsgId === interaction.message.id);
            if (!currentProduction) {
                /*
                    To update users, we have to copy the data, delete the data, update the data, and place the data.
                    Because of this, simultaneous button presses cannot occur or they will cause an error.
                */
                interaction.reply({
                    content: 'The bot cannot handle multiple button presses at once, please click again shortly',
                    ephemeral: true
                })
                return;
            }
            if (!currentProduction.volunteers.find((volunteer: string) => volunteer === interaction.user.id)) {
                await interaction.reply({
                    content: 'YO U WANNA NOT?',
                    ephemeral: true
                })
                return;
            }
            await productionsRef.update({
                productions: FieldValue.arrayRemove(currentProduction)
            }).catch(() => interaction.reply({ content: 'Could not update user', ephemeral: true}));
            const index = currentProduction.volunteers.indexOf(interaction.user.id);
            currentProduction.volunteers.splice(index, 1);
            await productionsRef.update({
                productions: FieldValue.arrayUnion(currentProduction)
            }).catch(() => interaction.reply({ content: 'Could not update user', ephemeral: true}));
            const volChl = await interaction.guild?.channels.cache.get(proChannel) as BaseGuildTextChannel;
            const volunteerMsg = await volChl.messages.fetch(currentProduction.volunteerMsgId);

            let volunteers = `(${currentProduction.volunteers.length}) `;
            for (let i = 0; i < currentProduction.volunteers.length; i++)
                volunteers += `<@${currentProduction.volunteers[i]}> `;
            const field = volunteerMsg.embeds[0].fields
            if (currentProduction.volunteers.length === 0)
                volunteers = '(0) 🦗';
            field[4] = {
                name: 'Volunteers',
                value: volunteers
            }
            const unVolCh = await interaction.guild?.channels.cache.find((ch) => ch.id === currentProduction.channelId) as BaseGuildTextChannel;
            const unVolunteerMsg = await unVolCh.messages.fetch(currentProduction.unVolunteerMsgId);

            let updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
            await volunteerMsg.edit({embeds: [updatedProduction]});
            await unVolunteerMsg.edit({embeds: [updatedProduction]});
            const currProChannel = await interaction.guild?.channels.cache.find(ch => ch.id === currentProduction.channelId) as BaseGuildTextChannel;
            await currProChannel.permissionOverwrites.delete(interaction.user.id);
            await interaction.reply(`${userMention(interaction.user.id)} has unvolunteered this production!`);
        });
    }
}