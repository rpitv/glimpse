# RPI TV Glimpse Discord
An RPI TV Discord Bot that uses the Discord API and the Glimpse API intended to ease the operations in RPI TV.

## Installing / Getting Started
---
This repository requires a temporary database in [firebase's firestore](https://firebase.google.com/?gclid=Cj0KCQjwteOaBhDuARIsADBqRegWWNYObuAFnbyr8QELgCXP514UtKWHKfzJ77DnqWDqVnhTOE4qYLQaApulEALw_wcB&gclsrc=aw.ds) and [discord's developer portal](https://discord.com/login?redirect_to=%2Fdevelopers) to create a bot.
Make sure to create a .env file in the root directory.


## Setting up firestore
---
Head over to [firebase](https://firebase.google.com/?gclid=Cj0KCQjwteOaBhDuARIsADBqRegWWNYObuAFnbyr8QELgCXP514UtKWHKfzJ77DnqWDqVnhTOE4qYLQaApulEALw_wcB&gclsrc=aw.ds) and click "Go to console" near the top right.

![Homepage](https://i.imgur.com/TWy44gm.png)

You should be greeted with a "Welcome to Firebase!" page. Underneath that message has a button labeled "Create a project" and click it.

![Create Project](https://i.imgur.com/6g5tyC7.png)

Enter any project name you wish, accept the terms and confirm your usage for Firebase, then click continue.

![Enter name and continue](https://i.imgur.com/vVEAUhC.png)

It's optional for you to choose whether or not to enable google analytics in this step.

If you check it off, just click "Create Project". Otherwise, accept terms and click "Create Project".

![Google Analytics](https://i.imgur.com/P7irCAk.png)

Over on the left is a "Build" dropdown. Click on it and then click on the "Firestore Database".

![Build](https://i.imgur.com/2hyhzgI.png)

![Firestore](https://i.imgur.com/i8wxrMM.png)

On that page, there should be a button "Create Database". Click on it, and you'll be greeted with a popup. Just click "Next", and "Enable".

![FirestorePage](https://i.imgur.com/8OMLGFf.png)
![Firestorepopup](https://i.imgur.com/R4whHgn.png)
![https://i.imgur.com/lfU5sOV.png](https://i.imgur.com/lfU5sOV.png)

After it finishes setting up, you've now setup a firestore database! Now we need to click on the cog wheel at the top left right next to "Project Overview" and click on "Project Settings". 

![](https://i.imgur.com/y2hpKlZ.png)
![](https://i.imgur.com/jWT30LR.png)


At the top, click on "Service accounts". Scroll a bit down and click "Generate new private key" and then "Generate Key". This will download a json file. Rename it to serviceAccountKey and drop it into the root directory of your cloned repo.

![https://i.imgur.com/8tyj6mi.png](https://i.imgur.com/8tyj6mi.png)
![https://i.imgur.com/jW9bvxT.png](https://i.imgur.com/jW9bvxT.png)
## Setting up the discord bot
---
Head over to the [Discord Developer Portal](https://discord.com/login?redirect_to=%2Fdevelopers) and login if necessary. Over at the top right, click "New Application", give it any name, and accept the terms.

![https://i.imgur.com/vfZ6Bm4.png](https://i.imgur.com/vfZ6Bm4.png)
![https://i.imgur.com/axcGPda.png](https://i.imgur.com/axcGPda.png)

Over on the left, click on "Bot", then over on the right, click "Add Bot", it will prompt you, click "Yes, do it!".
Then click on "Reset Token" and copy it. Go to the .env file of the root directory and type in "TOKEN=" and paste in the token that you copied.

![https://i.imgur.com/MYAKNOb.png](https://i.imgur.com/MYAKNOb.png)
![https://i.imgur.com/tr9UJju.png](https://i.imgur.com/tr9UJju.png)
![https://i.imgur.com/DC2sggi.png](https://i.imgur.com/DC2sggi.png)
![https://i.imgur.com/pJb7gSc.png](https://i.imgur.com/pJb7gSc.png)
![https://i.imgur.com/azpyAC8.png](https://i.imgur.com/azpyAC8.png)

 Scroll down to "Privileged Gateway Intents" and turn on "Presence Intent", "Server Members Intent", and "Message Content Intent". Make sure to save the changes.
 ![https://i.imgur.com/BQ9v375.png](https://i.imgur.com/BQ9v375.png)

Going back to the left, click on OAuth2 and then URL Generator underneath it. Under scopes, check on "bot", scroll a bit down to "Bot permissions", and check on "Administrator".
![https://i.imgur.com/07hu7sz.png](https://i.imgur.com/07hu7sz.png)
![https://i.imgur.com/zTKbmCl.png](https://i.imgur.com/zTKbmCl.png)
![image.png](https://i.imgur.com/1rDyJ9g.png)
![https://i.imgur.com/HvRZNoO.png](https://i.imgur.com/HvRZNoO.png)

Now copy the generated URL all the way at the bottom and paste it into the search bar. This will prompt an invite for the bot to a server where you can invite the bot. Make sure to invite it to a server where you can test it. Once you've invited it, you've finished this step!

![https://i.imgur.com/sRKuZlx.png](https://i.imgur.com/sRKuZlx.png)
![https://i.imgur.com/RVBz7Wu.png](https://i.imgur.com/RVBz7Wu.png)

## Other requirements
---
1. Ensure your Discord Account is in developer mode. This enables you to check Ids of pretty much everything. To do so open up Discord (desktop) and click on the cog wheel at the bottom left. Under "App Settings", there is a button named "Advanced". Click on it, and then at the top, turn on Developer Mode.
2. Set up the other env variables. Currently, there are two other environment variables to set up. GUILD_ID and CLIENT_ID. The GUILD_ID will be the server where your tests will run. To get the ID, simply hover over the server icon on the left of your Discord application, right click on it, and click "Copy ID". Paste it into the .env file formatted like such: "GUILD_ID=" and then the id. The CLIENT_ID is the ID of the bot. To get the ID, go the server members on the right and right click on your bot. Click "Copy ID" and paste it into the .env file formatted like such: "CLIENT_ID=" and then the id.
3. Remember to run `npm i` to install the necessary packages to run the bot.
4. By default, no commands on the bot will be registered to the server even after running `node index`. In order to add the commands currently on the bot to your server, run `node deploy-commands`. 
5. To turn on the bot run  `node index`.

## Development 
---
This project is using [discord.js](https://discord.js.org/#/) version 14, [dotenv](https://www.npmjs.com/package/dotenv), [moment.js](https://momentjs.com/), and [firebase-admin](https://www.npmjs.com/package/firebase-admin). Therefore, knowledge on javascript/typescript is important to add features to the bot.

firebase-admin is important to be able to interact with the firestore database (TEMPORARY).
### discord.js
discord.js is important to simplify the interaction with the Discord API.

Due to the sheer size of discord.js, I'd recommend reading the [discord.js documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome) and/or [discord.js guide](https://discordjs.guide/#before-you-begin).

### dotenv
dotenv is important to use environment variables

We are able to access our environment variables with process.env.{name of variable}.

### moment.js
moment.js is nice to have to format time

View its documentation [here](https://momentjs.com/docs/)

### firebase-admin (TEMPORARY)
firebase-admin is important to be able to interact with the firestore database.

View the FIRESTORE documentation [here](https://firebase.google.com/docs/firestore)

## Creating and sorting files
---
A majority code written is nested in folders and seperated into multiple files for organization.

Take a look at the [index file](/commands/index.js) in the commands directory. If we were to add a command, we'd also have to make sure it is "required" and sorted alphabetically in our index file in the commands directory.

We add handlers to ensure that the files are read:
```
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const commandFiles = require('./commands/index');
const customIdFiles = require('./customIds/index');
const eventFiles = require('./events/index');

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
```
## Writing Events
---
By far the easiest code to write is for events. As of writing this documentation, there is no need for any additional event listeners from discord.js. Therefore, you can just leave it untouched.

### Writing Commands
---
Commands must undergo the basic structure of:

```
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder
        .setName(*NAME OF FILE*),
    async execute(interaction) {
        /*
            Insert code here
        */
    }
}
```

You can read more about the SlashCommandBuilder [here](https://discordjs.guide/creating-your-bot/slash-commands.html#before-you-continue). Unfortunately the documentation does not contain any information about it. If you're interested in what interaction does, simply console log it. This will be an object with tons of data and will contain functions that you can use to do something with data. However, it's impossible to cover all the methods so the best bet is to just go on stackoverflow.

## Writing Custom Ids
---
When a user makes an interaction, very likely that interaction has a custom id. The only exception I know at the moment is ChatInputCommands/slash commands. An example of an interaction is clicking on a button or selecting something from the select menu. 

To distinguish the button or the selection from other buttons or selections in our bot is to give it customIds because both of these events emit the Event.InteractionCreate and it'd be really bad if we have button whose function is to make the bot say yes and a selection in the menu whose function makes the bot say no both say yes. It should be noted that there is a way to check if one of these interactions is a button click or a menu select, so let's replace the selection with another button and this is why custom ids are important.

The format for writing a custom id is as follows:

```
module.exports = {
    name: *NAME OF THE CUSTOM ID*,
    async execute(interaction) {
        /*
            Insert code here
        */
    }
}
```

Note that if you don't know what interaction contains, you can always console log it before resorting to stack overflow.

### Custom Ids Vs. Collectors/AwaitMessages/AwaitMessageComponents
---
First off, if you don't know what discord js collectors are, you can completely ignore this part of the documentation.

Early on in the discord bot, I've considered using collectors as the primary way to listen for interactions to execute code. This avoids creating a directory for custom ids, less code, and we can even filter the input! 

However, as I continued to play around with it, and this is from what I saw, you cannot have more than one unique collector per channel, meaning that if you ran the same command twice, the bot crashes. If you prevented the crash, you'd have two collectors which run into the problem of un-unique ids. 

There was also the thought of what if the bot needs a restart and there's a production live? The thing about collectors compared to regular event listeners for discord is that they don't persist after restarts. When restarting the bot, it runs the index file which runs the interactionCreate listener which listens to when events are called to execute code from the specific files. This means that once the bot has fully restarted, it can resume its duties.

Collectors perish after restarts and this is certainly fine for commands but not for buttons that need to stay active for long periods of time and is why there will be no collectors for this bot. Maybe in the future, but we have yet gotten to that point in time.