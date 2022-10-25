const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, commandID)) // commandID = id of command
    .then(() => console.log('Sucessfully deleted application command'))
    .catch((err) => console.err(err));