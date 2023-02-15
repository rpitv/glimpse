import {CustomId} from "../../types";
import {BaseGuildTextChannel, CategoryChannel, EmbedBuilder, EmbedField, SelectMenuInteraction} from "discord.js";
import {db} from "../../firebase";


export const proCategorySelection: CustomId = {
    name: "proCategorySelection",
    async execute(interaction: SelectMenuInteraction) {
        const categoryId = interaction.values[0];
        await db.collection("rpi-tv").doc("setup").set({
            proCategory: categoryId
        }, { merge: true });
        const setup = await interaction.guild?.channels.fetch(interaction.message.reference?.channelId as string) as BaseGuildTextChannel;
        const setupDashboard = await setup?.messages.fetch(interaction.message.reference?.messageId as string);
        const setupField = setupDashboard?.embeds[0].fields;

        const category = await interaction.guild?.channels.fetch(categoryId) as CategoryChannel;
        setupField[1] = {
            name: "2️⃣ Productions Category",
            value: category.name
        }

        const newSetupDashboard = EmbedBuilder.from(setupDashboard.embeds[0]).setFields(setupField);
        await setupDashboard.edit({ embeds: [newSetupDashboard] });
        await interaction.reply({ content: "Successfully set!", ephemeral: true })
    }
}