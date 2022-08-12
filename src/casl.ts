import { Ability, AbilityBuilder } from "@casl/ability";
import type { AbilityClass } from "@casl/ability";
import { ABILITY_TOKEN, useAbility } from "@casl/vue";
import type { InjectionKey, Ref } from "vue";
import { computed } from "vue";
import {
  AbilityActions as GQLAbilityActions,
  AbilitySubjects as GQLAbilitySubjects,
} from "@/graphql/types";
import { useAuthStore } from "@/stores/auth";

export type AbilityActions = GQLAbilityActions;
export type AbilitySubjects = GQLAbilitySubjects | Record<any, any>;
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

export function canViewDashboard(): Ref<boolean> {
  const authStore = useAuthStore();
  // Create temporary variable storing a copy of ability
  let tmpAbility = ability;

  // If user is logged in, remove ability to edit self from temporary ability. This way, when we check if
  //   the user can Update any Users, it won't report true just because they can edit themselves.
  if (authStore.isLoggedIn && typeof authStore.userId === "number") {
    const builder = new AbilityBuilder(GlimpseAbility);
    // Add all rules from current ability
    for (const rule of ability.rules) {
      // Check if this is an update rule specifically with the condition for the user's ID
      if (
        rule.action === GQLAbilityActions.Update &&
        rule.conditions?.id === authStore.userId
      ) {
        // If so, check if it's referring to the "User" subject, and remove it if so.
        // Easy first check is if the subject is literally just "User".
        if (rule.subject === GQLAbilitySubjects.User) {
          continue;
        } else if (Array.isArray(rule.subject)) {
          // If it's an array, remove all "User" subjects from the array.
          let idx: number;
          while ((idx = rule.subject.indexOf(GQLAbilitySubjects.User)) > -1) {
            rule.subject.splice(idx, 1);
          }
          // If the array is now empty, remove the rule.
          if (rule.subject.length === 0) {
            continue;
          }
        }
      }
      builder.rules.push(rule);
    }
    tmpAbility = builder.build();
  }

  return computed(() => {
    // prettier-ignore
    return (
      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.AccessLog) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.AccessLog) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.AccessLog) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.AccessLog) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.AlertLog) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.AlertLog) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.AlertLog) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.AlertLog) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.AuditLog) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.AuditLog) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.AuditLog) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.AuditLog) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.BlogPost) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.BlogPost) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.BlogPost) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Category) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Category) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Category) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.ContactSubmissionAssignee) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.ContactSubmissionAssignee) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ContactSubmissionAssignee) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ContactSubmissionAssignee) ||

      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.ContactSubmission) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ContactSubmission) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ContactSubmission) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Credit) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Credit) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Credit) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.GroupPermission) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.GroupPermission) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.GroupPermission) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Group) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Group) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Group) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Image) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Image) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Image) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Person) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Person) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Person) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.PersonImage) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.PersonImage) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.PersonImage) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.ProductionImage) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ProductionImage) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ProductionImage) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.ProductionRsvp) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.ProductionRsvp) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ProductionRsvp) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ProductionRsvp) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.ProductionTag) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ProductionTag) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ProductionTag) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.ProductionVideo) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.ProductionVideo) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.ProductionVideo) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Production) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Production) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Production) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Redirect) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Redirect) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Redirect) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Role) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Role) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Role) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.UserGroup) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.UserGroup) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.UserGroup) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.UserPermission) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.UserPermission) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.UserPermission) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.User) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.User) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.User) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Video) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Video) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Video) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.Vote) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.Vote) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.Vote) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.Vote) ||

      tmpAbility.can(GQLAbilityActions.Create, GQLAbilitySubjects.VoteResponse) ||
      tmpAbility.can(GQLAbilityActions.Read, GQLAbilitySubjects.VoteResponse) ||
      tmpAbility.can(GQLAbilityActions.Update, GQLAbilitySubjects.VoteResponse) ||
      tmpAbility.can(GQLAbilityActions.Delete, GQLAbilitySubjects.VoteResponse)
    );
  });
}

export function hasAnyActionPermissionForSubject(
  subject: AbilitySubjects,
  actions?: AbilityActions[]
): boolean {
  if (!actions) {
    return (
      ability.can(GQLAbilityActions.Create, subject) ||
      ability.can(GQLAbilityActions.Read, subject) ||
      ability.can(GQLAbilityActions.Update, subject) ||
      ability.can(GQLAbilityActions.Delete, subject)
    );
  } else {
    return actions.some((action) => {
      return ability.can(action, subject);
    });
  }
}
