const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')
const { db } = require('../firebase');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) { 
        const setupRef = db.collection('rpi-tv').doc('setup')
        const setupData = await setupRef.get()
        let { proCategory, proChannel, active } = setupData.data();
        if (active === true) return interaction.reply({ content: 'Command currently active', ephemeral: true });
        setupRef.set({ active: true }, { merge: true })
        const checkFields = (embed) => {
            if (proChannel)
                embed.data.fields[0] = { name: '1️⃣ Productions Channel', value: `<#${proChannel}>` }
            if (proCategory)
                embed.data.fields[1] = { name: '2️⃣ Productions Category', value: proCategory }
        }

        let setupEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Current Setup (Time limit before the message expires is 2 minutes)')
            .setDescription('Basic overview of the setup for this server')
            .setFooter({ text: 'Click on a button to setup'})
            .addFields(
                {name: '1️⃣ Productions Channel', value: `DNE`},
                {name: '2️⃣ Productions Category', value: `DNE`}
            );
        checkFields(setupEmbed);
        
        let setupRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('proChannel')
                    .setLabel('1️⃣')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('proCategory')
                    .setLabel('2️⃣')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('🗑')
                    .setStyle(ButtonStyle.Danger)
            );
        
        const filter = (i) => i.user.id === interaction.user.id;
        const buttonCollector = interaction.channel.createMessageComponentCollector({ filter: filter });
        buttonCollector.on('collect', i => {
            if (i.customId === 'delete'){
                buttonCollector.stop();
                return;
            }
            for (let j = 0; j < setupRow.components.length; j++){
                setupRow.components[j].setDisabled(true);
                interaction.editReply({ components: [setupRow]});
            }
            i.reply({
                content: "Tag or copy the id of what ever you're trying to get and submit it here (Do not delete this ephemeral)",
                ephemeral: true,
            })
            
            const msgFilter = (m) => m.author.id === interaction.user.id;
            const messageCollector = interaction.channel.createMessageCollector({ filter: msgFilter, time: 120000, max: 1 });
            messageCollector.on('collect', m => {
                let id = m.content
                m.delete();
                
                id = id.replace('<', '').replace('>', '').replace('#', '').replace('@', '').replace('&', '');
                if (i.customId === 'proChannel') {
                    if (!i.guild.channels.cache.get(id)) {
                        i.editReply('Invalid channel');
                    }else{
                    setupRef.set({proChannel: id}, { merge: true })
                        .then(() => {
                            proChannel = id;
                            i.editReply('Successfully set!');
                            checkFields(setupEmbed);
                            interaction.editReply({ embeds: [setupEmbed] })
                        })
                        .catch(() => i.editReply('Could not set'))
                    }
                }
                if (i.customId === 'proCategory'){
                    // Make sure that it exists in the server
                    if (!interaction.guild.channels.cache.find(cat => cat.id === id)){
                        i.editReply('Could not find the category');
                    // Make sure that it is a category
                    }else if (interaction.guild.channels.cache.find(cat => cat.id === id).type !== 4) {
                        i.editReply('Not a category');
                    }else {
                    setupRef.set({proCategory: id}, { merge: true })
                        .then(() => {
                            proCategory = id;
                            i.editReply('Successfully set!');
                            checkFields(setupEmbed);
                            interaction.editReply({ embeds: [setupEmbed] })
                        })
                        .catch(() => i.editReply('Could not set'))
                    }
                }

                for (let j = 0; j < setupRow.components.length; j++){
                    setupRow.components[j].setDisabled(false);
                    interaction.editReply({ components: [setupRow] });
                }
            })
        })
        buttonCollector.on('end', async (c) => {
            if (c.message)
                c.message.delete();
            setupRef.set({ active: false }, { merge: true })
        })
        

        interaction.reply({ embeds: [setupEmbed], components: [setupRow] });
    }
}