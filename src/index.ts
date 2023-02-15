import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits, ActivityType } from "discord.js";
import {Command, CustomId} from "./types";
import { events } from "./events";
import { commands } from "./commands"
import { customIds } from "./customIds";
import moment from "moment";

config();

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