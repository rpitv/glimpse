import {Event, Productions, Setup} from "../types";
import {ActivityType, Client, Events, GuildTextBasedChannel} from "discord.js";
import {db} from "../firebase";
import moment from "moment";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;

export const ready: Event = {
    name: Events.ClientReady,
    async execute(client: Client) {
        console.log(`Ready!, Logged in as ${client.user?.tag}`);
        client.user?.setActivity({
            name: "Tetris",
            type: ActivityType.Playing
        });
        // Checks if productions have passed their closet date
        setInterval(async () => {
            await db.collection("rpi-tv").doc("productions").get().then(async (snapshot) => {
                if (!snapshot.data()) return;
                const { productions } = snapshot.data() as Productions;
                if (!productions) return;

                for (const production of productions) {
                    const expiryDate = moment(production.inputValueClosetDate, "YYYYMMDD").endOf("day").fromNow();
                    if (!expiryDate.includes("ago")) continue;

                    await db.collection("rpi-tv").doc("setup").get().then(async (setup) => {
                        const { proChannel } = setup.data() as Setup;
                        if (!proChannel) return;

                        const currentGuild = await client.guilds.cache.get(process.env.GUILD_ID);
                        const volunteerChannel = await currentGuild?.channels.cache.get(proChannel) as GuildTextBasedChannel;
                        const volunteerMsg = await volunteerChannel.messages.fetch(production.volunteerMsgId);

                        const unVolunteerChannel = await currentGuild?.channels.cache.get(production.channelId) as GuildTextBasedChannel;
                        const unVolunteerMsg = await unVolunteerChannel.messages.fetch(production.unVolunteerMsgId);

                        volunteerMsg.edit({components: []});
                        unVolunteerMsg.edit({components: []});

                        await db.collection("rpi-tv").doc("productions").update({
                            productions: FieldValue.arrayRemove(production)
                        });
                    });
                }
            });
        },  1000)
    }
}