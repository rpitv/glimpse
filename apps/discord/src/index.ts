import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { discordEvents } from "./events/discord";
import moment from "moment";
import { GlimpseApiEvents } from "./api/GlimpseApiInterface";
import { MockGlimpseApi } from "./api/MockGlimpseApi";
import { glimpseAPIEvents } from "./events/api";
import { CustomId } from "./types";
import { customIds } from "./customIds";

function loadEnvironmentVariables() {
  config(); // load env variables
  if (!process.env.GUILD_ID)
    throw new Error("GUILD_ID environment variable not set");

  if (!process.env.PRODUCTIONS_CHANNEL_ID)
    throw new Error("PRODUCTIONS_CHANNEL_ID environment variable not set");

  if (!process.env.VOLUNTEER_CHANNEL_ID)
    throw new Error("VOLUNTEER_CHANNEL_ID environment variable not set");

  if (!process.env.RPITV_ID)
    throw new Error("RPITV_ID environment variable not set");

  if (!process.env.TOKEN)
    throw new Error("TOKEN environment variable not set");

  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable not set");

  if (!process.env.CLIENT_ID)
    throw new Error("CLIENT_ID environment variable not set");

  // if(!process.env.RABBITMQ_URL) {
  //     throw new Error("RABBITMQ_URL environment variable not set");
  // }
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


// Event Handler
for (const event of discordEvents)
  if (event.once)
    client.once(event.name, (arg) => event.execute(arg));
  else
    client.on(event.name, (arg) => event.execute(arg));

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
const glimpseApi = new MockGlimpseApi();

for (const event of glimpseAPIEvents)
  glimpseApi.on(event.name as keyof GlimpseApiEvents, (arg) => event.execute(arg, client, glimpseApi));


client.login(process.env.TOKEN);

// setTimeout(() => {
//   glimpseApi.emit("createProduction", {
//     id: 1n,
//     name: "Test Production",
//     description: "A test production",
//     closetTime: new Date(),
//     startTime: new Date(),
//     endTime: new Date(),
//     tags: ["test"],
//     useDiscord: true,
//   });
// }, 1000);
