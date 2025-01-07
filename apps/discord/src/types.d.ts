import { type SlashCommandBuilder, ChatInputCommandInteraction, Client, SlashCommandOptionsOnlyBuilder } from "discord.js"
import type { GlimpseApiInterface } from "./api";
import { Collection } from "discord.js";

export interface Command {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void,
}

export interface CustomId {
    name: string,
    execute: (interaction: any) => void,
}

export interface DiscordEvent {
    name: string,
    once?: boolean,
    execute: (...interaction: any) => void;
}

export interface APIEvent {
    name: string,
    execute: (arg: any, client: Client, api: GlimpseApiInterface) => void;
}

export interface ProductionDiscordData {
  threadChannelId: string,
  volunteerMessageId: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GUILD_ID: string
            PRODUCTIONS_CHANNEL_ID: string
            VOLUNTEER_CHANNEL_ID: string
            ADMIN_ALERTS_CHANNEL_ID: string
            TOKEN: string
            DATABASE_URL: string
            RPITV_ID: string
            CLIENT_ID: string
            RABBITMQ_URL: string
        }
    }
}


declare module "discord.js" {
  export interface Client {
    customIds: Collection<string, CustomId>;
    commands: Collection<string, Command>;
  }
}
