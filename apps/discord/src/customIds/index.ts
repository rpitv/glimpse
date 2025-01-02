import { unvolunteer } from "./unvolunteer";
import { volunteer } from "./volunteer";
import { CustomId } from "../types";
import { register } from "./register";
import { volunteerWithNotes } from "./volunteerWithNotes";
import { volunteerNotesSubmission } from "./volunteerNotesSubmission";
import { getVolunteerWithNotes } from "./getVolunteerNotes";

export const customIds: CustomId[] = [
  getVolunteerWithNotes,
  register,
  unvolunteer,
  volunteer,
  volunteerWithNotes,
  volunteerNotesSubmission
];