import type { AbilityClass } from "@casl/ability";
import { Ability, AbilityBuilder } from "@casl/ability";
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

/**
 * Shorthand for requiring the user to have at least one action permission for a subject.
 * @param subject The subject to check permissions for.
 * @param actions Optionally, the list of actions to check. If not provided, all actions are checked (CRUD).
 * @param glimpseAbility Custom ability to check against if desired. If omitted, then the default ability with the
 *   current user's permissions is used.
 * @returns true if the use has permission on the subject for at least one of the provided actions, false otherwise.
 */
export function hasAnyActionPermissionForSubject(
  subject: AbilitySubjects,
  actions?: AbilityActions[],
  glimpseAbility?: GlimpseAbility
): boolean {
  if (!actions) {
    actions = [
      GQLAbilityActions.Create,
      GQLAbilityActions.Read,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ];
  }
  if (!glimpseAbility) {
    glimpseAbility = ability;
  }
  return actions.some((action) => {
    // No longer possibly undefined
    return (<GlimpseAbility>glimpseAbility).can(action, subject);
  });
}

/**
 * Check whether the currently logged-in user has permission to open the "Assets" page on the dashboard. At the moment,
 *   the requirement for this is to have any CRUD permission on the "Asset" subject.
 */
export function canViewAssetsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Asset);
}

/**
 * Check whether the currently logged-in user has permission to open the "Blog Posts" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "BlogPost" subject.
 */
export function canViewBlogPostsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.BlogPost, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Categories" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Category" subject.
 */
export function canViewCategoriesDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Category, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Contact Submissions" page on the dashboard.
 *   At the moment, the requirement for this is to be able to read, update, or delete ContactSubmissions, or to
 *   have any CRUD permission on the "ContactSubmissionAssignee" subject.
 */
export function canViewContactSubmissionsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.ContactSubmission, [
      GQLAbilityActions.Read,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(
      GQLAbilitySubjects.ContactSubmissionAssignee
    )
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Groups" page on the dashboard.
 *   At the moment, the requirement for this is to have any CRUD permission for the "Group" subject, or to have any CRUD
 *   permission on the "GroupPermission" subject besides read.
 *   TODO: We should be more specific and allow access if you can read permissions for groups which you don't belong to.
 */
export function canViewGroupsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.Group) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.GroupPermission, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Images" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Image" subject.
 */
export function canViewImagesDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Image, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Logs" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission on the "AccessLog", "AuditLog", or "AlertLog"
 *   subjects.
 */
export function canViewLogsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.AlertLog) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.AccessLog) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.AuditLog)
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "People" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Person" subject, or to have
 *   any CRUD permission besides read on the "PersonImage" subject.
 *   TODO: Users in the future should be able to edit their own Person profile(s). This would be outside of the
 *     dashboard, and a separate check needs to be made to exclude their own Persons from this check.
 */
export function canViewPeopleDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.Person, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.PersonImage, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Productions" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on one of the subjects "Production",
 *   "ProductionImage", "ProductionTag", "ProductionVideo", or "Credit". Alternatively, the user may have any CRUD
 *   permission on the "ProductionRsvp" subject.
 */
export function canViewProductionsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.Production, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.ProductionImage, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.ProductionTag, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.ProductionVideo, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.Credit, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.ProductionRsvp)
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Redirects" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Redirect" subject.
 */
export function canViewRedirectsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Redirect, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Stream" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission on the "Stream" subject.
 */
export function canViewStreamDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Stream, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Read,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Users" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "User" subject, except for
 *   the ability to update themselves. I.e., having permission to update themselves is not enough to be able to
 *   view the Users page. The user must also be able to edit other users in some way, or able to delete their own account.
 *
 *   Alternatively, the user can have any CRUD permission on the "UserPermission" subject besides read.
 *   TODO: We should be more specific and allow access if you can read permissions other than your own.
 */
export function canViewUsersDashboard(): boolean {
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

  return (
    hasAnyActionPermissionForSubject(
      GQLAbilitySubjects.User,
      [
        GQLAbilityActions.Create,
        GQLAbilityActions.Update,
        GQLAbilityActions.Delete,
      ],
      tmpAbility
    ) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.UserPermission, [
      GQLAbilityActions.Create,
      GQLAbilityActions.Update,
      GQLAbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Videos" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Video" subject.
 */
export function canViewVideosDashboard(): boolean {
  return hasAnyActionPermissionForSubject(GQLAbilitySubjects.Video, [
    GQLAbilityActions.Create,
    GQLAbilityActions.Update,
    GQLAbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Votes" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission either on the "Vote" or "VoteResponse" subjects.
 */
export function canViewVotesDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.Vote) ||
    hasAnyActionPermissionForSubject(GQLAbilitySubjects.VoteResponse)
  );
}

export function canViewDashboard(): Ref<boolean> {
  return computed(() => {
    return (
      canViewAssetsDashboard() ||
      canViewBlogPostsDashboard() ||
      canViewCategoriesDashboard() ||
      canViewContactSubmissionsDashboard() ||
      canViewGroupsDashboard() ||
      canViewImagesDashboard() ||
      canViewLogsDashboard() ||
      canViewProductionsDashboard() ||
      canViewRedirectsDashboard() ||
      canViewStreamDashboard() ||
      canViewVideosDashboard() ||
      canViewVotesDashboard() ||
      canViewUsersDashboard() || // Perform these last due to computation order
      canViewPeopleDashboard()
    );
  });
}
