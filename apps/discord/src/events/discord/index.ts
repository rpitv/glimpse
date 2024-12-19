import { DiscordEvent } from "../../types";
import { ready } from "./ready";
import { interactionCreate } from "./interactionCreate";

export const discordEvents: DiscordEvent[] = [
    ready, interactionCreate
];
