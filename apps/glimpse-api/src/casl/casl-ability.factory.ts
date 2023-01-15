import {ExtractSubjectType, InferSubjects, RawRuleOf} from "@casl/ability";
import {User} from "../user/user.entity";
import {createPrismaAbility, PrismaAbility} from "@casl/prisma";
import {Injectable, Logger} from "@nestjs/common";
import {GroupPermission, UserPermission} from "@prisma/client"; // FIXME import nestjs entities instead
import {PrismaService} from "../prisma/prisma.service";

export enum AbilityAction {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}
export type AbilitySubjects = InferSubjects<typeof User, true> | 'all';
export type GlimpseAbility = PrismaAbility<[AbilityAction, AbilitySubjects]>;

@Injectable()
export class CaslAbilityFactory {

    private readonly logger: Logger = new Logger('CaslAbilityFactory');
    constructor(private readonly prisma: PrismaService) {}

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
    async getPermissions(
        user?: User
    ): Promise<(UserPermission | GroupPermission)[]> {
        if (user) {
            const userPermissions = await this.prisma.userPermission.findMany({
                where: {
                    userId: user.id
                }
            });

            const groupPermissions = await this.prisma.groupPermission.findMany({
                where: {
                    groupId: {
                        in: (await this.prisma.userGroup.findMany({
                            where: {
                                userId: user.id
                            }
                        })).map((userGroup) => userGroup.groupId)
                    }
                }
            })

            const permissions = [...userPermissions, ...groupPermissions];
            delete (<any>user).password; // Hide password from logs
            this.logger.debug(
                { user, permissions },
                `Retrieved permissions for user ${user.id} from database`
            );

            return permissions;
        } else {
            const guestPermissions = await this.prisma.groupPermission.findMany({
                where: {
                    group: {
                        name: 'Guest'
                    }
                }
            })

            this.logger.debug(
                guestPermissions,
                "Retrieved guest permissions from database"
            );

            return guestPermissions;
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
        const rawPermissions = <RawRuleOf<GlimpseAbility>[]>(
            await this.getPermissions(user)
        );
        return createPrismaAbility<GlimpseAbility>(rawPermissions, {
            detectSubjectType: (obj) => obj.constructor as ExtractSubjectType<AbilitySubjects>
        });
    }
}
