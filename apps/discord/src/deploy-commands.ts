import { REST, Routes } from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands";

config();

const serverCommands = [];

for (const command of commands) {
    serverCommands.push(command.data);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: serverCommands })
    .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);