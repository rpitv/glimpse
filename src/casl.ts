import { Ability } from "@casl/ability";
import type { AbilityClass } from "@casl/ability";
import { ABILITY_TOKEN, useAbility } from "@casl/vue";
import type { InjectionKey, Ref } from "vue";
import { computed } from "vue";

export type AbilityActions = "read" | "create" | "update" | "delete" | "manage";
export type AbilitySubjects =
  | "Production"
  | "User"
  | "Role"
  | "ContactSubmission";
export type GlimpseAbility = Ability<[AbilityActions, AbilitySubjects]>;

export const GlimpseAbility = Ability as AbilityClass<GlimpseAbility>;
export const TOKEN = ABILITY_TOKEN as InjectionKey<GlimpseAbility>;
export const ability = new GlimpseAbility();

export function useGlimpseAbility() {
  return useAbility<GlimpseAbility>();
}

export function requirePermission(
  action: AbilityActions,
  subject: AbilitySubjects,
  field?: string
): () => Ref<boolean> {
  return () => {
    return computed(() => {
      return ability.can(action, subject, field);
    });
  };
}
