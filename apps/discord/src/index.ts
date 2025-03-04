import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { discordEvents } from "./events/discord";
import moment from "moment";
import type { GlimpseApiEvents } from "./api";
import { glimpseAPIEvents } from "./events/api";
import { Command, CustomId } from "./types";
import { customIds } from "./customIds";
import commands from "./commands";
import { glimpseApi } from "./util";

function loadEnvironmentVariables() {
  config(); // load env variables
  if (!process.env.GUILD_ID)
    throw new Error("GUILD_ID environment variable not set");

  if (!process.env.PRODUCTIONS_CHANNEL_ID)
    throw new Error("PRODUCTIONS_CHANNEL_ID environment variable not set");

  if (!process.env.VOLUNTEER_CHANNEL_ID)
    throw new Error("VOLUNTEER_CHANNEL_ID environment variable not set");

  if (!process.env.ADMIN_ALERTS_CHANNEL_ID)
    throw new Error("ADMIN_ALERTS_CHANNEL_ID environment variable not set");

  if (!process.env.RPITV_ID)
    throw new Error("RPITV_ID environment variable not set");

  if (!process.env.TOKEN)
    throw new Error("TOKEN environment variable not set");

  if (!process.env.CLIENT_ID)
    throw new Error("CLIENT_ID environment variable not set");

  if(!process.env.RABBITMQ_URL)
      throw new Error("RABBITMQ_URL environment variable not set");

  if(!process.env.WEB_URL)
      throw new Error("WEB_URL environment variable not set");
}

loadEnvironmentVariables();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildScheduledEvents,
  ]
});

client.customIds = new Collection<string, CustomId>();
client.commands = new Collection<string, Command>();

// Commands
for (const command in commands)
  client.commands.set(commands[command].data.name, commands[command]);

// Discord Event Handler
for (const event of discordEvents)
  if (event.once)
    client.once(event.name, (...arg) => event.execute(...arg));
  else
    client.on(event.name, (...arg) => event.execute(...arg));

// CustomId Handler
for (const customId of customIds)
  client.customIds.set(customId.name, customId);

client.on('debug', console.log);
client.on('error', console.error);

// Error handler
process.on("unhandledRejection", error => {
  console.error("At", moment().utcOffset("300").format("MM/DD/YYYY HH:mm:ss"), "Unhandled promise rejection:", error);
  process.exit();
});

// API Handler

for (const event of glimpseAPIEvents)
  glimpseApi.on(event.name as keyof GlimpseApiEvents, (arg) => event.execute(arg, client, glimpseApi));


client.login(process.env.TOKEN);
