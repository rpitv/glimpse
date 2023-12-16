import { cancelproduction } from "./cancelproduction";
import { createproduction } from "./createproduction";
import { editproduction } from "./editproduction";
import {Command} from "../types";
import {register} from "./register";

export const commands: Command[] = [
    cancelproduction, createproduction, editproduction, register
];
