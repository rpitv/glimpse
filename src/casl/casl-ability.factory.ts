import { InferSubjects, RawRuleOf } from "@casl/ability";
import { User } from "../user/user.entity";
import { createPrismaAbility, PrismaAbility } from "@casl/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { GroupPermission, UserPermission } from "@prisma/client"; // FIXME import nestjs entities instead
import { PrismaService } from "../prisma/prisma.service";

export enum AbilityAction {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Sort = "sort",
    Filter = "filter",
    Update = "update",
    Delete = "delete"
}
export type AbilitySubjects = InferSubjects<typeof User, true> | "all";
export type GlimpseAbility = PrismaAbility<[AbilityAction, AbilitySubjects]>;

/**
 * Visit each value in an object and apply a visitor function to it.
 * @param obj Object to visit each property of.
 * @param visitor Visitor function to apply to each value. The return value of this function is used as the new value.
 */
function visit(obj: Record<string, any>, visitor: (key: string, value: any) => any): any {
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object") {
            visit(obj[key], visitor);
        } else {
            obj[key] = visitor(key, obj[key]);
        }
    }
}

@Injectable()
export class CaslAbilityFactory {
    private readonly logger: Logger = new Logger("CaslAbilityFactory");
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Replace variables within a permission's conditions with their actual values.
     *  Currently supported variables:
     *  - $id: Replaced with the ID of the user that is logged in. Throws an error if no user is logged in.
     * @param permission Permission to replace variables in.
     * @param user User that is currently logged in, or undefined or null if no user is logged in.
     * @returns An updated Permission object with the variables replaced.
     */
    replaceConditionVariables<T extends UserPermission | GroupPermission>(permission: T, user?: User | null): T {
        const conditions = permission.conditions;

        if (conditions && typeof conditions === "object") {
            visit(conditions, (key, value) => {
                if (value === "$id") {
                    if (!user) {
                        throw new Error("Cannot replace $id variable in conditions because no user is logged in.");
                    }
                    this.logger.verbose(`Replacing $id variable in conditions with user ID ${user.id}.`);
                    return user.id;
                }

                // Replace escaped variables with their unescaped versions
                if (value === "\\$id") {
                    return "$id";
                }
            });
        }

        return permission;
    }

    /**
     * Get the permissions objects for a specified user from the database. Also retrieves the
     *   permissions for the group(s) that they are in and combines them into one permission set.
     *   If the user does not have any denying permissions, then this is straightforward. If the
     *   user has any denying permissions, then they are applied in the order of the priority of
     *   the groups, with the higher priority groups' permissions ranking higher than lower priority
     *   groups. The user's direct permissions are applied last.
     * @param user User to get the permissions for, or undefined if there is no user that is
     *   currently logged in. If that is the case, then default permissions are retrieved from
     *   the reserved group "Guest". If the "Guest" group does not exist, then it's assumed
     *   the user has no permissions, and must log in to do anything.
     * @returns An array of either UserPermission or GroupPermission objects.
     */
    async getPermissions(user?: User): Promise<(UserPermission | GroupPermission)[]> {
        // Raw queries are used here due to a quirk in Prisma which converts null arrays to empty arrays, which
        //  CASL does not like. See: https://github.com/prisma/prisma/issues/847
        if (user) {
            const userPermissions = await this.prisma.$queryRaw<
                UserPermission[]
            >`SELECT id, "user" AS "userId", action, subject, fields, conditions, inverted, reason
                        FROM user_permissions WHERE "user" = ${user.id}`;

            const groupPermissions = await this.prisma.$queryRaw<
                GroupPermission[]
            >`SELECT  id, "group" AS "groupId", action, subject, fields, conditions, inverted, reason
                        FROM group_permissions WHERE "group" IN (SELECT "group" FROM user_groups WHERE 
                        "user" = ${user.id})`;

            const permissions = [...userPermissions, ...groupPermissions].map((permission) =>
                this.replaceConditionVariables(permission, user)
            );

            delete (<any>user).password; // Hide password from logs
            this.logger.debug(`Retrieved permissions for user ${user.id} from database`, { user, permissions });

            // Must make an assumption that the database has correct values due to raw query.
            return <(UserPermission | GroupPermission)[]>permissions;
        } else {
            const guestPermissions = await this.prisma
                .$queryRaw`SELECT id, "group" as "groupId", action, subject, fields, conditions, inverted, reason 
                                        FROM group_permissions WHERE "group" = (SELECT id FROM groups WHERE 
                                                              name = 'Guest' LIMIT 1)`;

            this.logger.debug("Retrieved guest permissions from database", guestPermissions);

            // Must make an assumption that the database has correct values due to raw query.
            return <GroupPermission[]>guestPermissions;
        }
    }

    // /**
    //  * Check that a given Ability grants permission to update a given subject, and all the necessary fields. For example,
    //  *   if you want to check that a user has permission to update {x: 1, y: 2} to {x: 3, y: 4}, this method checks that:
    //  *   - The user has permission to update "x" on object {x: 1, y: 2}
    //  *   - The user has permission to update "y" on object {x: 1, y: 2}
    //  *   - The user has permission to update "x" on object {x: 3, y: 4}
    //  *   - The user has permission to update "y" on object {x: 3, y: 4}
    //  *   If any of these checks fail, then the method returns false. Otherwise, it returns true.
    //  * @param ability Ability to check. This is typically retrieved from the current context.
    //  * @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
    //  * @param oldValue Old value of the subject.
    //  * @param newValue New value of the subject. This isn't required to be complete. The new value is merged with the old
    //  *   value, so any fields not in the new value are inherited from the old value.
    //  */
    // canUpdate(
    //     ability: GlimpseAbility,
    //     subjectType: AbilitySubjects,
    //     oldValue: Record<string, any>,
    //     newValue: Record<string, any>
    // ): boolean {
    //     // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    //     newValue = { ...newValue };
    //     oldValue = { ...oldValue };
    //
    //     // Check that the user has permission to update at least one field in the subject in its current state.
    //     //   Not required, but saves time in the case that the user has no permission to update any fields.
    //     if (!ability.can("update", subject(subjectType, oldValue))) {
    //         return false;
    //     }
    //     // Check that the user has permission to update each individual field in the subject in its current state.
    //     for (const key in oldValue) {
    //         if (!ability.can("update", subject(subjectType, oldValue), key)) {
    //             return false;
    //         }
    //     }
    //
    //     // Destructure old value and new value, so that missing fields in the new value default to old value.
    //     newValue = { ...oldValue, ...newValue };
    //
    //     // Check that the user has permission to update at least one field of the subject to its new state.
    //     //   Not required, but saves time in the case that the user has no permission to update any fields.
    //     if (!ability.can("update", subject(subjectType, newValue))) {
    //         return false;
    //     }
    //     // Check that the user has permission to update each individual field in the subject to its new state.
    //     for (const key in newValue) {
    //         if (!ability.can("update", subject(subjectType, newValue), key)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    //
    // /**
    //  * Check that a given Ability grants permission to delete a given subject, and all the necessary fields. For example,
    //  *  if you want to check that a user has permission to delete {x: 1, y: 2}, this method checks that:
    //  *  - The user has permission to delete "x" on object {x: 1, y: 2}
    //  *  - The user has permission to delete "y" on object {x: 1, y: 2}
    //  *  If any of these checks fail, then the method returns false. Otherwise, it returns true.
    //  *  @param ability Ability to check. This is typically retrieved from the current context.
    //  *  @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
    //  *  @param value Value of the subject.
    //  */
    // canDelete(
    //     ability: GlimpseAbility,
    //     subjectType: AbilitySubjects,
    //     value: Record<string, any>
    // ): boolean {
    //     // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    //     value = { ...value };
    //     // Check that the user has permission to delete at least one field in the subject.
    //     //   Not required, but saves time in the case that the user has no permission to delete any fields.
    //     if (!ability.can("delete", subject(subjectType, value))) {
    //         return false;
    //     }
    //     // Check that the user has permission to delete each individual field in the subject.
    //     for (const key in value) {
    //         if (!ability.can("delete", subject(subjectType, value), key)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    //
    // /**
    //  * Check that a given Ability grants permission to create a given subject, and all the necessary fields. For example,
    //  *  if you want to check that a user has permission to create {x: 1, y: 2}, this method checks that:
    //  *  - The user has permission to create "x" on object {x: 1, y: 2}
    //  *  - The user has permission to create "y" on object {x: 1, y: 2}
    //  *  If any of these checks fail, then the method returns false. Otherwise, it returns true.
    //  *  @param ability Ability to check. This is typically retrieved from the current context.
    //  *  @param subjectType Type of subject we're checking. E.g. "User". This is passed to CASL's subject().
    //  *  @param value Value of the subject. Note, this method does not merge in default values assigned by the database!
    //  *    If you pass in {x: 1}, but the database assigns a default "y" value of 2, this method will return true even
    //  *    if the user doesn't have permission to create objects with "y" set to 2. For this reason, granular permissions
    //  *    on fields with defaults are currently not recommended.
    //  */
    // canCreate(
    //     ability: GlimpseAbility,
    //     subjectType: AbilitySubjects,
    //     value: Record<string, any>
    // ): boolean {
    //     // Add hasOwnProperty method to value. Requirement of CASL at the moment: https://github.com/stalniy/casl/issues/604
    //     value = { ...value };
    //     // Check that the user has permission to create at least one field in the subject.
    //     //   Not required, but saves time in the case that the user has no permission to create any fields.
    //     if (!ability.can("create", subject(subjectType, value))) {
    //         return false;
    //     }
    //     // Check that the user has permission to create each individual field in the subject.
    //     for (const key in value) {
    //         if (!ability.can("create", subject(subjectType, value), key)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    async createForUser(user: User): Promise<GlimpseAbility> {
        this.logger.verbose(`Fetching rules for the current user (user ID: ${user?.id || null})`);
        const rawPermissions = <RawRuleOf<GlimpseAbility>[]>await this.getPermissions(user);
        return createPrismaAbility<GlimpseAbility>(rawPermissions);
    }
}
