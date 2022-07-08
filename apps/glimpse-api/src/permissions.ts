import {RawRuleOf, subject} from "@casl/ability";
import {AbilityActions, AbilitySubjects, GlimpseAbility} from "custom";
import {User} from ".prisma/client";

export
type Permission = { action: AbilityActions, subject?: AbilitySubjects, field?: string };

/**
 * Get the permissions for a specified user from the database. Also retrieves the permissions
 *   for the group(s) that they are in and combines them into one permission set. If the user
 *   does not have any denying permissions, then this is straightforward. If the user has any
 *   denying permissions, then they are applied in the order of the priority of the groups,
 *   with the higher priority groups' permissions ranking higher than lower priority groups.
 *   The user's direct permissions are applied last.
 * @param user User to get the permissions for, or undefined if there is no user that is
 *   currently logged in. If that is the case, then default permissions are retrieved from
 *   the reserved group "Guest". If the "Guest" group does not exist, then it's assumed
 *   the user has no permissions, and must log in to do anything.
 * @returns An array of CASL rules which can be passed directly to the Ability constructor.
 */
export async function getPermissions(user?: User): Promise<RawRuleOf<GlimpseAbility>[]> {
    return [{
        action: 'read',
        subject: 'User',
        conditions: {
            NOT: {
                id: 3
            }
        }
    },{
        action: 'read',
        subject: 'Person',
        fields: ['id']
    }];
}

/**
 * Check that a given Ability grants permission to update a given subject, and all the necessary fields. For example,
 *   if you want to check that a user has permission to update {x: 1, y: 2} to {x: 3, y: 4}, this method checks that:
 *   - The user has permission to update "x" on object {x: 1, y: 2}
 *   - The user has permission to update "y" on object {x: 1, y: 2}
 *   - The user has permission to update "x" on object {x: 3, y: 4}
 *   - The user has permission to update "y" on object {x: 3, y: 4}
 *   If any of these checks fail, then the method returns false. Otherwise, it returns true.
 * @param ability Ability to check. This is typically retrieved from the current context.
 * @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
 * @param oldValue Old value of the subject.
 * @param newValue New value of the subject. This isn't required to be complete. The new value is merged with the old
 *   value, so any fields not in the new value are inherited from the old value.
 */
export function canUpdate(ability: GlimpseAbility, subjectType: AbilitySubjects, oldValue: Record<string, any>, newValue: Record<string, any>): boolean {
    // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    newValue = {...newValue};
    oldValue= {...oldValue};

    // Check that the user has permission to update at least one field in the subject in its current state.
    //   Not required, but saves time in the case that the user has no permission to update any fields.
    if(!ability.can('update', subject(subjectType, oldValue))) {
        return false;
    }
    // Check that the user has permission to update each individual field in the subject in its current state.
    for(const key in oldValue) {
        if(!ability.can('update', subject(subjectType, oldValue), key)) {
            return false;
        }
    }

    // Destructure old value and new value, so that missing fields in the new value default to old value.
    newValue = {...oldValue, ...newValue};

    // Check that the user has permission to update at least one field of the subject to its new state.
    //   Not required, but saves time in the case that the user has no permission to update any fields.
    if(!ability.can('update', subject(subjectType, newValue))) {
        return false;
    }
    // Check that the user has permission to update each individual field in the subject to its new state.
    for(const key in newValue) {
        if(!ability.can('update', subject(subjectType, newValue), key)) {
            return false;
        }
    }
    return true;
}

/**
 * Check that a given Ability grants permission to delete a given subject, and all the necessary fields. For example,
 *  if you want to check that a user has permission to delete {x: 1, y: 2}, this method checks that:
 *  - The user has permission to delete "x" on object {x: 1, y: 2}
 *  - The user has permission to delete "y" on object {x: 1, y: 2}
 *  If any of these checks fail, then the method returns false. Otherwise, it returns true.
 *  @param ability Ability to check. This is typically retrieved from the current context.
 *  @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
 *  @param value Value of the subject.
 */
export function canDelete(ability: GlimpseAbility, subjectType: AbilitySubjects, value: Record<string, any>): boolean {
    // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    value = {...value};
    // Check that the user has permission to delete at least one field in the subject.
    //   Not required, but saves time in the case that the user has no permission to delete any fields.
    if(!ability.can('delete', subject(subjectType, value))) {
        return false;
    }
    // Check that the user has permission to delete each individual field in the subject.
    for(const key in value) {
        if(!ability.can('delete', subject(subjectType, value), key)) {
            return false;
        }
    }
    return true;
}

/**
 * Check that a given Ability grants permission to create a given subject, and all the necessary fields. For example,
 *  if you want to check that a user has permission to create {x: 1, y: 2}, this method checks that:
 *  - The user has permission to create "x" on object {x: 1, y: 2}
 *  - The user has permission to create "y" on object {x: 1, y: 2}
 *  If any of these checks fail, then the method returns false. Otherwise, it returns true.
 *  @param ability Ability to check. This is typically retrieved from the current context.
 *  @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
 *  @param value Value of the subject. Note, this method does not merge in default values assigned by the database!
 *    If you pass in {x: 1}, but the database assigns a default "y" value of 2, this method will return true even
 *    if the user doesn't have permission to create objects with "y" set to 2. For this reason, granular permissions
 *    on fields with defaults are currently not recommended.
 */
export function canCreate(ability: GlimpseAbility, subjectType: AbilitySubjects, value: Record<string, any>): boolean {
    // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    value = {...value};
    // Check that the user has permission to create at least one field in the subject.
    //   Not required, but saves time in the case that the user has no permission to create any fields.
    if(!ability.can('create', subject(subjectType, value))) {
        return false;
    }
    // Check that the user has permission to create each individual field in the subject.
    for(const key in value) {
        if(!ability.can('create', subject(subjectType, value), key)) {
            return false;
        }
    }
    return true;
}
