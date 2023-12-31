import type { AbilityClass, MongoQuery, InferSubjects } from "@casl/ability";
import { AbilityBuilder, PureAbility } from "@casl/ability";
import { ABILITY_TOKEN, useAbility } from "@casl/vue";
import type { InjectionKey, Ref } from "vue";
import { computed } from "vue";
import { AbilitySubjects } from "@/graphql/types";
import type {
  User,
  AccessLog,
  AlertLog,
  Asset,
  AuditLog,
  BlogPost,
  Category,
  ContactSubmission,
  Credit,
  Group,
  GroupPermission,
  Image,
  Person,
  PersonImage,
  PersonRole,
  ProductionImage,
  ProductionRsvp,
  ProductionTag,
  ProductionVideo,
  Production,
  Redirect,
  Role,
  Stream,
  UserGroup,
  UserPermission,
  Video,
  Vote,
  VoteResponse,
} from "@/graphql/types";
import { useAuthStore } from "@/stores/auth";
import {createPrismaAbility} from "@casl/prisma";

export enum AbilityActions {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
  Manage = "manage",
  Sort = "sort",
  Filter = "filter",
}

export type GlimpseAbility = PureAbility<[AbilityActions, InferSubjects<AbilitySubjectTypes> | AbilitySubjects], MongoQuery>;
type AbilitySubjectTypes =
  | User
  | AccessLog
  | AlertLog
  | Asset
  | AuditLog
  | BlogPost
  | Category
  | ContactSubmission
  | Credit
  | Group
  | GroupPermission
  | Image
  | Person
  | PersonImage
  | PersonRole
  | ProductionImage
  | ProductionRsvp
  | ProductionTag
  | ProductionVideo
  | Production
  | Redirect
  | Role
  | Stream
  | UserGroup
  | UserPermission
  | Video
  | Vote
  | VoteResponse;

export const GlimpseAbility = PureAbility as AbilityClass<GlimpseAbility>;
export const TOKEN = ABILITY_TOKEN as InjectionKey<GlimpseAbility>;
export const ability = createPrismaAbility() as GlimpseAbility;

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
      AbilityActions.Create,
      AbilityActions.Read,
      AbilityActions.Update,
      AbilityActions.Delete,
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
  return hasAnyActionPermissionForSubject(AbilitySubjects.Asset);
}

/**
 * Check whether the currently logged-in user has permission to open the "Blog Posts" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "BlogPost" subject.
 */
export function canViewBlogPostsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.BlogPost, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Categories" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Category" subject.
 */
export function canViewCategoriesDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Category, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Contact Submissions" page on the dashboard.
 *   At the moment, the requirement for this is to be able to read, update, or delete ContactSubmissions, or to
 *   have any CRUD permission on the "ContactSubmissionAssignee" subject.
 */
export function canViewContactSubmissionsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.ContactSubmission, [
    AbilityActions.Read,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Groups" page on the dashboard.
 *   At the moment, the requirement for this is to have any CRUD permission for the "Group" subject, or to have any CRUD
 *   permission on the "GroupPermission" subject besides read.
 *   TODO: We should be more specific and allow access if you can read permissions for groups which you don't belong to.
 */
export function canViewGroupsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(AbilitySubjects.Group) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.GroupPermission, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Images" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Image" subject.
 */
export function canViewImagesDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Image, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Logs" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission on the "AccessLog", "AuditLog", or "AlertLog"
 *   subjects.
 */
export function canViewLogsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(AbilitySubjects.AlertLog) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.AccessLog) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.AuditLog)
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "People" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Person", "PersonImage", or
 *   "PersonRole" subjects.
 *   TODO: Users in the future should be able to edit their own Person profile(s). This would be outside of the
 *     dashboard, and a separate check needs to be made to exclude their own Persons from this check.
 */
export function canViewPeopleDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(AbilitySubjects.Person, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.PersonImage, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.PersonRole, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Roles" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Role" subject.
 */
export function canViewRolesDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Role, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Productions" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on one of the subjects "Production",
 *   "ProductionImage", "ProductionTag", "ProductionVideo", or "Credit". Alternatively, the user may have any CRUD
 *   permission on the "ProductionRsvp" subject.
 */
export function canViewProductionsDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(AbilitySubjects.Production, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.ProductionImage, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.ProductionTag, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.ProductionVideo, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.Credit, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ]) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.ProductionRsvp)
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Redirects" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Redirect" subject.
 */
export function canViewRedirectsDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Redirect, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Stream" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission on the "Stream" subject.
 */
export function canViewStreamDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Stream, [
    AbilityActions.Create,
    AbilityActions.Read,
    AbilityActions.Update,
    AbilityActions.Delete,
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
    const builder = new AbilityBuilder<GlimpseAbility>(createPrismaAbility);
    // Add all rules from current ability
    for (const rule of ability.rules) {
      // Check if this is an update rule specifically with the condition for the user's ID
      if (
        rule.action === AbilityActions.Update &&
        rule.conditions?.id === authStore.userId
      ) {
        // If so, check if it's referring to the "User" subject, and remove it if so.
        // Easy first check is if the subject is literally just "User".
        if (rule.subject === AbilitySubjects.User) {
          continue;
        } else if (Array.isArray(rule.subject)) {
          // If it's an array, remove all "User" subjects from the array.
          let idx: number;
          while ((idx = rule.subject.indexOf(AbilitySubjects.User)) > -1) {
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
      AbilitySubjects.User,
      [AbilityActions.Create, AbilityActions.Update, AbilityActions.Delete],
      tmpAbility
    ) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.UserPermission, [
      AbilityActions.Create,
      AbilityActions.Update,
      AbilityActions.Delete,
    ])
  );
}

/**
 * Check whether the currently logged-in user has permission to open the "Videos" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission besides read on the "Video" subject.
 */
export function canViewVideosDashboard(): boolean {
  return hasAnyActionPermissionForSubject(AbilitySubjects.Video, [
    AbilityActions.Create,
    AbilityActions.Update,
    AbilityActions.Delete,
  ]);
}

/**
 * Check whether the currently logged-in user has permission to open the "Votes" page on the dashboard. At the
 *   moment, the requirement for this is to have any CRUD permission either on the "Vote" or "VoteResponse" subjects.
 */
export function canViewVotesDashboard(): boolean {
  return (
    hasAnyActionPermissionForSubject(AbilitySubjects.Vote) ||
    hasAnyActionPermissionForSubject(AbilitySubjects.VoteResponse)
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
