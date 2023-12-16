import {CustomId} from "../types";
import {sendRPC} from "../amqp";


export const register: CustomId = {
    name: "register",
    async execute(interaction) {
        // Check if a user is already registered with this Discord account connected
        const currentUser = (await sendRPC<any[]>("findManyUser", {
            filter: {
                discord: { equals: interaction.user.id }
            },
            pagination: { take: 1 }
        }))[0]

        if (currentUser) {
            await interaction.reply({
                content: "You already have a Glimpse account. Contact an officer if you need help.",
                ephemeral: true
            })
            return;
        }

        const isUsernameTaken = (await sendRPC<any[]>("findManyUser", {
            filter: {
                username: { equals: interaction.fields.getTextInputValue("username") }
            },
            pagination: { take: 1 }
        })).length > 0
        if(isUsernameTaken) {
            await interaction.reply({
                content: "That username is already taken.",
                ephemeral: true
            });
            return;
        }
        const isEmailTaken = (await sendRPC<any[]>("findManyUser", {
            filter: {
                mail: { equals: interaction.fields.getTextInputValue("email") }
            },
            pagination: { take: 1 }
        })).length > 0
        if(isEmailTaken) {
            await interaction.reply({
                content: "That email address is already associated with another account.",
                ephemeral: true
            });
            return;
        }

        try {
            await sendRPC<any>("createUser", {data: {
                discord: interaction.user.id,
                username: interaction.fields.getTextInputValue("username"),
                mail: interaction.fields.getTextInputValue("email")
            }});
        } catch(e) {
            console.error(e);
            await interaction.reply({
                content: "Failed to create account. Contact an administrator.",
                ephemeral: true
            });
            return;
        }

        await interaction.reply({
            content: "Account created! Log in with Discord at https://rpi.tv/login. To set a password, go to https://rpi.tv/account.",
            ephemeral: true
        });
    }
}
