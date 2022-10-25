const dotenv = require('dotenv');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

dotenv.config();

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');
const customIdsPath = path.join(__dirname, 'customIds');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const customIdFiles = fs.readdirSync(customIdsPath).filter(file => file.endsWith('.js'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();
client.customIds = new Collection();

// Command handler
for (const commandFile of commandFiles) {
    const commandPath = path.join(commandsPath, commandFile);
    const command = require(commandPath);
    client.commands.set(command.data.name, command);
}

// Event handler
for (const eventFile of eventFiles) {
	const filePath = path.join(eventsPath, eventFile);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// CustomId handler
for (const customIdFile of customIdFiles) {
	const customIdPath = path.join(customIdsPath, customIdFile);
	const customId = require(customIdPath);
	client.customIds.set(customId.name, customId);
}

client.login(process.env.TOKEN);