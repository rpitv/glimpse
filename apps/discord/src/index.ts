import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits, ActivityType } from "discord.js";
import {Command, CustomId} from "./types";
import { events } from "./events";
import { commands } from "./commands"
import { customIds } from "./customIds";
import moment from "moment";

function loadEnvironmentVariables() {
    config(); // load env variables
    if (!process.env.GUILD_ID)
        throw new Error("GUILD_ID environment variable not set");

    if (!process.env.PRODUCTIONS_CHANNEL_ID)
        throw new Error("PRODUCTIONS_CHANNEL_ID environment variable not set");

    if (!process.env.PRODUCTIONS_CATEGORY_ID)
        throw new Error("PRODUCTIONS_CATEGORY_ID environment variable not set");

    if (!process.env.RPITV_ID)
        throw new Error("RPITV_ID environment variable not set");

    if (!process.env.TOKEN)
        throw new Error("TOKEN environment variable not set");

    if (!process.env.DATABASE_URL)
        throw new Error("DATABASE_URL environment variable not set");

    if(!process.env.RABBITMQ_URL) {
        throw new Error("RABBITMQ_URL environment variable not set");
    }
}

loadEnvironmentVariables();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection<string, Command>();
client.customIds = new Collection<string, CustomId>();

// Command Handler
for (const command of commands)
    client.commands.set(command.data.name, command);

// Event Handler
for (const event of events)
    if (event.once)
        client.once(event.name, (arg) => event.execute(arg));
    else
        client.on(event.name, (arg) => event.execute(arg));

// CustomId handler
for (const customId of customIds)
    client.customIds.set(customId.name, customId);

// Error handler
process.on("unhandledRejection", error => {
    console.error("At", moment().utcOffset("300").format("MM/DD/YYYY HH:mm:ss"), "Unhandled promise rejection:", error);
    process.exit();
});

client.login(process.env.TOKEN);
