import {REST, Routes} from 'discord.js';
import { config } from 'dotenv';
import commandFiles from './commands/index';
import {Command} from "./types";

config();

const commands: Command[] = [];

for (const command in commandFiles) {
  commands.push(commandFiles[command].data);
}

if (typeof(process.env.TOKEN) === "undefined")
  throw new Error("Token is not defined");

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

if (typeof(process.env.CLIENT_ID) === "undefined")
  throw new Error("Client ID is not defined");

if (typeof(process.env.GUILD_ID) === "undefined")
  throw new Error("Guild ID is not defined");

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  // @ts-ignore
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
