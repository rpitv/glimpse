const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const commandFiles = require('./commands/index');

dotenv.config();

const commands = [];

for (const command of commandFiles) {
    commands.push(command.data);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);