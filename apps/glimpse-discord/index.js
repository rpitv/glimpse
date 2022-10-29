const dotenv = require('dotenv');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const commandFiles = require('./commands/index');
const customIdFiles = require('./customIds/index');
const eventFiles = require('./events/index');

dotenv.config();

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
for (const command of commandFiles) {
    client.commands.set(command.data.name, command);
}

// Event handler
for (const event of eventFiles) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// CustomId handler
for (const customId of customIdFiles) {
	client.customIds.set(customId.name, customId);
}

client.login(process.env.TOKEN);