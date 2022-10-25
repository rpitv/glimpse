const { db } = require('../firebase')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		await db.collection('rpi-tv').doc('setup').set({
			active: false
		}, {
			merge: true
		});
	},
};