import { DiscordEvent } from "../../types";
import {
    ActivityType,
    Client,
    Events,
} from "discord.js";
import { MockGlimpseApi } from "../../api/MockGlimpseApi";
import { createProduction } from "../api/createProduction";


export const ready: DiscordEvent = {
    name: Events.ClientReady,
    async execute(client: Client) {
        console.log(`Ready!, Logged in as ${client.user?.tag}`);
        client.user?.setActivity({
            name: "Tetris",
            type: ActivityType.Playing
        }); 
        const glimpseApi = new MockGlimpseApi();
        // Get any productions that did not have discord channels created for.
        const productions = await glimpseApi.getLatestProductions();
        // for (const production of productions.getData()) {
        //   if (!production.discordData) {
        //     await createProduction.execute(production, client, glimpseApi);
        //     break;
        //   }
        // }
    }
}