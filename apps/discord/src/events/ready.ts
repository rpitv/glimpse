import {Event} from "../types";
import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder, ButtonComponent,
    Client,
    Events,
    Message,
    TextChannel
} from "discord.js";
import { db } from "../db";
import { productions } from "../schema";
import {eq} from "drizzle-orm";


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
            // const productions = (await sendRPC<any[]>("findManyProduction", { filter: {
            //             endTime: { lt: Date.now() - postEventChannelTTL },
            //             discordChannel: { not: null },
            //             discordServer: { not: null },
            //             isDiscordChannelArchived: { equals: false }
            //         }}));

            const currentProductions = await db.query.productions.findMany();
            if(!currentProductions) return;
            for (const currentProduction of currentProductions) {
                if ((Date.now() - postEventChannelTTL) < (currentProduction.endTime.valueOf() as number)) continue;
                const currentGuild = await client.guilds.fetch(process.env.GUILD_ID);
                const volunteerChannel = await currentGuild.channels.fetch(process.env.PRODUCTIONS_CHANNEL_ID) as TextChannel;
                const volunteerMsg = await volunteerChannel.messages.fetch(currentProduction.volunteerEmbedId) as unknown as Message<true>;
                const unVolunteerChannel = await currentGuild.channels.fetch(currentProduction.channelId as string) as TextChannel;
                const unVolunteerMsg = await unVolunteerChannel.messages.fetch(currentProduction.unVolunteerEmbedId) as unknown as Message<true>;

                const disabledVolunteerButton = volunteerMsg.components[0].components.map((button: ButtonComponent) => ButtonBuilder.from(button).setDisabled(true));
                const volunteerRow = new ActionRowBuilder<ButtonBuilder>().setComponents(disabledVolunteerButton);
                await volunteerMsg.edit({
                    components: [volunteerRow]
                }).catch((e) => {
                    console.error(e);
                });
                const disabledUnVolunteerButton = unVolunteerMsg.components[0].components.map((button: ButtonComponent) => ButtonBuilder.from(button).setDisabled(true));
                const unVolunteerRow = new ActionRowBuilder<ButtonBuilder>().setComponents(disabledUnVolunteerButton);
                await unVolunteerMsg.edit({
                    components: [unVolunteerRow]
                }).catch((e) => {
                    console.error(e);
                });

                await db.delete(productions).where(eq(productions.channelId, currentProduction.channelId as string));

                // const currentGuild = await client.guilds.cache.get(production.discordServer.trim());
                // const volunteerChannel = await currentGuild?.channels.cache.get(process.env.PRODUCTIONS_CHANNEL_ID as string) as GuildTextBasedChannel;
                // const volunteerMsg = await volunteerChannel.messages.fetch(production.discordVolunteerMessage.trim());
                //
                // const unVolunteerChannel = await currentGuild?.channels.cache.get(production.discordChannel.trim()) as GuildTextBasedChannel;
                // let unVolunteerMsg;
                // try {
                //     unVolunteerMsg = await unVolunteerChannel.messages.fetch(production.discordUnvolunteerMessage.trim());
                // } catch(e) {
                //     console.error(e);
                //     return;
                // }

                // await sendRPC<any[]>("updateProduction", {
                //     id: production.id,
                //     data: { isDiscordChannelArchived: true }
                // });

                // volunteerMsg.edit({components: []});
                // unVolunteerMsg.edit({components: []});
            }
        },  1000)
    }
}
