import {CustomId, Production, Setup} from "../../types";
import {db} from "../../firebase";
import {FieldValue} from "firebase-admin/firestore";
import {BaseGuildTextChannel, ButtonInteraction, EmbedBuilder} from "discord.js";


export const volunteer: CustomId = {
    name: "volunteer",
    async execute(interaction: ButtonInteraction) {
        const setupRef = await db.collection("rpi-tv").doc("setup").get();
        const { proChannel } = setupRef.data() as Setup;
        const productionsRef = db.collection("rpi-tv").doc("productions");
        await productionsRef.get().then(async (production) => {
            let currentProduction = production.data()?.productions.find((prod: Production) => prod.volunteerMsgId === interaction.message.id);
            if (!currentProduction) {
                /*
                    To update users, we have to copy the data, delete the data, update the data, and place the data.
                    Because of this, simultaneous button presses cannot occur, or they will cause an error.
                */
                await interaction.reply({
                    content: "The bot cannot handle multiple button presses at once, please click again shortly.\n" +
                        "Either that or this production doesn\'t exist...",
                    ephemeral: true
                })
                return;
            }
            if (currentProduction.volunteers.find((volunteer: string) => volunteer === interaction.user.id)) {
                await interaction.reply({
                    content: "You have already applied to volunteer for this event",
                    ephemeral: true
                })
                return;
            }
            await productionsRef.update({
                productions: FieldValue.arrayRemove(currentProduction)
            }).catch(() => interaction.reply({content: "Could not update user", ephemeral: true}));
            currentProduction.volunteers.push(interaction.user.id);
            await productionsRef.update({
                productions: FieldValue.arrayUnion(currentProduction)
            }).catch(() => interaction.reply({content: "Could not update user", ephemeral: true}));

            const volChl = interaction.guild?.channels.cache.get(proChannel) as BaseGuildTextChannel;
            const volunteerMsg = await volChl.messages.fetch(currentProduction.volunteerMsgId);
            let volunteers = `(${currentProduction.volunteers.length}) `;
            for (let i = 0; i < currentProduction.volunteers.length; i++)
                volunteers += `<@${currentProduction.volunteers[i]}> `;
            const field = volunteerMsg.embeds[0].fields;
            field[4] = {
                name: "Volunteers",
                value: volunteers
            }
            const unVolChl = interaction.guild?.channels.cache.get(currentProduction.channelId) as BaseGuildTextChannel;
            const unVolunteerMsg = await unVolChl.messages.fetch(currentProduction.unVolunteerMsgId);

            const updatedProduction = EmbedBuilder.from(volunteerMsg.embeds[0]).setFields(field);
            await volunteerMsg.edit({embeds: [updatedProduction]});
            await unVolunteerMsg.edit({embeds: [updatedProduction]});

            const currProChannel = await interaction.guild?.channels.cache.find((ch) => ch.id === currentProduction.channelId) as BaseGuildTextChannel;
            await currProChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true } );
            await interaction.reply({
                content: "Successfully volunteered!",
                ephemeral: true
            });
        });
    }
}