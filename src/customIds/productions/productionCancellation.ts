import { db } from "../../firebase";
import {CustomId, Production, Setup} from "../../types";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;
import {GuildTextBasedChannel} from "discord.js";


export const productionCancellation: CustomId = {
    name: "productionCancellation",
    async execute(interaction) {
        const setupRef = db.collection("rpi-tv").doc("setup");
        const setupData = await setupRef.get();
        const { proChannel } = setupData.data() as Setup;
        const productionsRef = db.collection("rpi-tv").doc("productions");
        const productionsData = await productionsRef.get();
        let currentProduction = productionsData.data()?.productions.find((production: Production) => production.channelId === interaction.channelId);

        if (!currentProduction) {
            interaction.reply({
                content: "Production not found! Please head to the channel of the production you want to edit",
                ephemeral: true
            })
            return;
        }
        await productionsRef.update({
            productions: FieldValue.arrayRemove(currentProduction)
        }).catch(() => interaction.reply({content: "Could not update user", ephemeral: true}));

        const productionChannel = await interaction.guild?.channels.fetch(proChannel) as GuildTextBasedChannel;
        productionChannel.messages.fetch(currentProduction.volunteerMsgId).then(msg => msg.delete());

        const currentProductionChannel = await interaction.guild?.channels.fetch(currentProduction.channelId) as GuildTextBasedChannel;
        await currentProductionChannel.delete();
    }
}