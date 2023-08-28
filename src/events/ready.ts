import {Event} from "../types";
import {ActivityType, Client, Events, GuildTextBasedChannel} from "discord.js";
import {sendRPC} from "../amqp";

// Number of milliseconds after a production ends that the channel will be deleted (12 hours)
const postEventChannelTTL = 12 * 60 * 60 * 1000;

export const ready: Event = {
    name: Events.ClientReady,
    async execute(client: Client) {
        console.log(`Ready!, Logged in as ${client.user?.tag}`);
        client.user?.setActivity({
            name: "Tetris",
            type: ActivityType.Playing
        });

        // Go over all outstanding productions and update their channels after the productions end
        setInterval(async () => {
            // Retrieve all productions that have a Discord channel and have passed their end time
            const productions = (await sendRPC<any[]>("findManyProduction", { filter: {
                        endTime: { lt: Date.now() - postEventChannelTTL },
                        discordChannel: { not: null },
                        discordServer: { not: null },
                        isDiscordChannelArchived: { equals: false }
                    }}));
            if(!productions) return;

            for (const production of productions) {
                const currentGuild = await client.guilds.cache.get(production.discordServer.trim());
                const volunteerChannel = await currentGuild?.channels.cache.get(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
                const volunteerMsg = await volunteerChannel.messages.fetch(production.discordVolunteerMessage.trim());

                const unVolunteerChannel = await currentGuild?.channels.cache.get(production.discordChannel.trim()) as GuildTextBasedChannel;
                let unVolunteerMsg;
                try {
                    unVolunteerMsg = await unVolunteerChannel.messages.fetch(production.discordUnvolunteerMessage.trim());
                } catch(e) {
                    console.error(e);
                    return;
                }

                await sendRPC<any[]>("updateProduction", {
                    id: production.id,
                    data: { isDiscordChannelArchived: true }
                });

                volunteerMsg.edit({components: []});
                unVolunteerMsg.edit({components: []});
            }
        },  1000)
    }
}
