import { DiscordEvent } from "../../types";
import { ready } from "./ready";
import { interactionCreate } from "./interactionCreate";
import { threadUpdate } from "./threadUpdate";

export const discordEvents: DiscordEvent[] = [
    ready, interactionCreate, threadUpdate
];
