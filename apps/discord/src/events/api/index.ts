import { APIEvent } from "../../types";
import { createProduction } from "./createProduction";
import { deleteProduction } from "./deleteProduction";
import { updateProduction } from "./updateProduction";

export const glimpseAPIEvents: APIEvent[] = [
  createProduction, deleteProduction, updateProduction
]