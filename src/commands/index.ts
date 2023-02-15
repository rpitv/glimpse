import { cancelproduction } from "./cancelproduction";
import { createproduction } from "./createproduction";
import { editproduction } from "./editproduction";
import { setup } from "./setup";
import {Command} from "../types";

export const commands: Command[] = [
    cancelproduction, createproduction, editproduction, setup
];