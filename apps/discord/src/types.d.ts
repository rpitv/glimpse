import { SlashCommandBuilder, ChatInputCommandInteraction, Collection } from "discord.js"

export interface Command {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => void,
}

export interface CustomId {
    name: string,
    execute: (interaction: any) => void,
}

export interface Event {
    name: string,
    once?: boolean,
    execute: (interaction: any) => void;
}

export interface Setup {
    proCategory: string,
    proChannel: string,
}

export interface Production {
    channelId: string,
    channelName: string,
    closetLocation: string,
    closetTime: string,
    date: string,
    endTime: string,
    eventName: string,
    inputValueClosetDate: string,
    inputValueTime: string,
    startTime: string,
    unVolunteerMsgId: string,
    volunteerMsgId: string,
    volunteers: string[],
}

export interface Productions {
    productions: Production[]
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            RPITV_ID: string,
            DATABASE_URL: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>,
        customIds: Collection<string, CustomId>,
    }
}
