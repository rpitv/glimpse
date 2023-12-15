const { db } = require('../firebase');
const { Events, ActivityType} = require('discord.js');
const moment = require('moment');
const { FieldValue } = require('firebase-admin/firestore');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity({
			name: "Tetris",
			type: ActivityType.Playing,
		});
		// Checks if productions have past their closet date
		setInterval(async () => {
			await db.collection('rpi-tv').doc('productions').get().then(async (snapshot) => {
				if (!snapshot.data()) return;
				const { productions } = snapshot.data();
				if (!productions) return;
				for (const production of productions) {
					const expiryDate = moment(production.inputValueClosetDate, 'YYYYMMDD').endOf('day').fromNow();
					if (expiryDate.includes('ago')){
						await db.collection('rpi-tv').doc('setup').get().then(async (setup) => {
							const proChannel = setup.data().proChannel;
							if (!proChannel) return;
							const currentGuild = await client.guilds.cache.get(process.env.GUILD_ID)
							const volunteerMsg = await currentGuild.channels.cache.get(proChannel)
								.messages.fetch(production.volunteerMsgId);
							const unVolunteerMsg = await currentGuild.channels.cache.get(production.channelId)
								.messages.fetch(production.unVolunteerMsgId);
							const volunteerBtn = volunteerMsg.components[0];
							const unVolunteerBtn = unVolunteerMsg.components[0];
							volunteerBtn.components[0].data.disabled = true;
							unVolunteerBtn.components[0].data.disabled = true;
							volunteerMsg.edit({components: [volunteerBtn]});
							unVolunteerMsg.edit({components: [unVolunteerBtn]});
							await db.collection('rpi-tv').doc('productions').update({
								productions: FieldValue.arrayRemove(production),
							})
						})
					}
				}
			})
		}, 86400 * 1000);
	},
};