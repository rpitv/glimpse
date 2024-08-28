import { cancelproduction } from "./cancelproduction";
import { createproduction } from "./createproduction";
import { editproduction } from "./editproduction";
import {Command} from "../types";

export const commands: Command[] = [
    cancelproduction, createproduction, editproduction
];
