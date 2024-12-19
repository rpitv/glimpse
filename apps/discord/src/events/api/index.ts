import { APIEvent } from "../../types";
import { createProduction } from "./createProduction";
import { deleteProduction } from "./deleteProduction";

export const glimpseAPIEvents: APIEvent[] = [
  createProduction, deleteProduction
]