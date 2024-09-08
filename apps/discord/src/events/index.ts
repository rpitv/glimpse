import { Event } from "../types";
import { ready } from "./ready";
import { interactionCreate } from "./interactionCreate";

export const events: Event[] = [
    ready, interactionCreate
];
