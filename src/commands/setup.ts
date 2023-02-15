import {Command, Setup} from "../types";
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    channelMention,
    Embed,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {db} from "../firebase";


export const setup: Command = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Sets up the bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        db.collection("rpi-tv").doc("setup").get().then(async (snapshot) => {
            const setup = snapshot.data() as Setup;
            const { proCategory, proChannel } = setup;
            const setupEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Setup Dashboard")
                .setDescription("Basic overview of the setup for this server")
                .setFooter({text: "Click on a button to setup"});

            if (proChannel)
                setupEmbed.addFields({name: "1️⃣ Productions Channel", value: `${channelMention(proChannel)}`})
            else
                setupEmbed.addFields({name: "1️⃣ Productions Channel", value: "DNE"})
            if (proCategory)
                setupEmbed.addFields({name: "2️⃣ Productions Category", value: `${channelMention(proCategory)}`})
            else
                setupEmbed.addFields({name: "2️⃣ Productions Category", value: "DNE"})

            const setupRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("proChannel")
                        .setLabel("1️⃣")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("proCategory")
                        .setLabel("2️⃣")
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({embeds: [setupEmbed], components: [setupRow]})
        });
    }
}