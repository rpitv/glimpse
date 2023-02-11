import { InferSubjects, RawRuleOf } from "@casl/ability";
import { User } from "../user/user.entity";
import { createPrismaAbility, PrismaAbility } from "@casl/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AccessLog } from "../access_log/access_log.entity";
import { AlertLog } from "../alert_log/alert_log.entity";
import { Asset } from "../asset/asset.entity";
import { AuditLog } from "../audit_log/audit_log.entity";
import { BlogPost } from "../blog_post/blog_post.entity";
import { Category } from "../category/category.entity";
import { ContactSubmission } from "../contact_submissions/contact_submission.entity";
import { Credit } from "../credit/credit.entity";
import { GroupPermission } from "../group_permission/group_permission.entity";
import { Group } from "../group/group.entity";
import { Image } from "../image/image.entity";
import { Person } from "../person/person.entity";
import { PersonImage } from "../person_image/person_image.entity";
import { PersonRole } from "../person_role/person_role.entity";
import { ProductionImage } from "../production_image/production_image.entity";
import { ProductionRSVP } from "../production_rsvp/production_rsvp.entity";
import { ProductionTag } from "../production_tag/production_tag.entity";
import {ProductionVideo} from "../production_video/production_video.entity";
import {Production} from "../production/production.entity";
import {Redirect} from "../redirect/redirect.entity";
import {Role} from "../role/role.entity";
import {UserGroup} from "../user_group/user_group.entity";
import {UserPermission} from "../user_permission/user_permission.entity";
import {Video} from "../video/video.entity";
import {Vote} from "../vote/vote.entity";
import {VoteResponse} from "../vote_response/vote_response.entity";

export enum AbilityAction {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Sort = "sort",
    Filter = "filter",
    Update = "update",
    Delete = "delete"
}
export type AbilitySubjects =
    | InferSubjects<
          | typeof User
          | typeof AccessLog
          | typeof AlertLog
          | typeof Asset
          | typeof AuditLog
          | typeof BlogPost
          | typeof Category
          | typeof ContactSubmission
          | typeof Credit
          | typeof Group
          | typeof GroupPermission
          | typeof Image
          | typeof Person
          | typeof PersonImage
          | typeof PersonRole
          | typeof ProductionImage
          | typeof ProductionRSVP
          | typeof ProductionTag
          | typeof ProductionVideo
          | typeof Production
          | typeof Redirect
          | typeof Role
          | typeof UserGroup
          | typeof UserPermission
          | typeof Video
          | typeof Vote
          | typeof VoteResponse,
          true
      >
    | "all";
export type GlimpseAbility = PrismaAbility<[AbilityAction, AbilitySubjects]>;

@Injectable()
export class CaslAbilityFactory {
    private readonly logger: Logger = new Logger("CaslAbilityFactory");
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Visit each value in an object and apply a visitor function to it. Used by {@link replaceConditionVariables}.
     * @param obj Object to visit each property of.
     * @param visitor Visitor function to apply to each value. The return value of this function is used as the new
     *  value.
     */
    private visit(obj: Record<string, any>, visitor: (key: string, value: any) => any): any {
        for (const key of Object.keys(obj)) {
            if (typeof obj[key] === "object") {
                this.visit(obj[key], visitor);
            } else {
                obj[key] = visitor(key, obj[key]);
            }
        }
    }

    /**
     * Replace variables within a permission's conditions with their actual values.
     *  Currently supported variables:
     *  - $id: Replaced with the ID of the user that is logged in. Throws an error if no user is logged in.
     * @param permission Permission to replace variables in.
     * @param user User that is currently logged in, or undefined or null if no user is logged in.
     * @returns An updated Permission object with the variables replaced.
     */
    private replaceConditionVariables<T extends UserPermission | GroupPermission>(
        permission: T,
        user?: User | null
    ): T {
        const conditions = permission.conditions;

        if (conditions && typeof conditions === "object") {
            this.visit(conditions, (key, value) => {
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

                return value;
            });
        }

        return permission;
    }

    /**
     * Get the permissions objects for a specified user from the database. Also retrieves the permissions for the
     *  group(s) that they are in and combines them into one permission set. If the user does not have any denying
     *  permissions, then this is straightforward. If the user has any denying permissions, then they are applied in the
     *  order of the priority of the groups, with the higher priority groups' permissions ranking higher than lower
     *  priority groups. The user's direct permissions are applied last.
     *  TODO The ordering here may not be correctly implemented. Tests are necessary.
     * @param user User to get the permissions for, or undefined if there is no user that is currently logged in. If
     *  that is the case, then default permissions are retrieved from the reserved group "Guest". If the "Guest" group
     *  does not exist, then it's assumed the user has no permissions, and must log in to do anything.
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
            this.logger.debug(
                `Retrieved permissions for user ${user.id} from database: ${JSON.stringify({ user, permissions })}`
            );

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

    /**
     * Create a {@link GlimpseAbility} permissions object for a specified user.
     * @param user The user to get the permissions for, or undefined to get the permissions for a guest user.
     * @returns A {@link GlimpseAbility} object.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     * @see {@link https://github.com/rpitv/glimpse-api/wiki/Authorization}
     */
    async createForUser(user?: User): Promise<GlimpseAbility> {
        this.logger.debug(`Fetching rules for the current user (user ID: ${user?.id || null})`);
        const rawPermissions = <RawRuleOf<GlimpseAbility>[]>await this.getPermissions(user);
        return createPrismaAbility<GlimpseAbility>(rawPermissions);
    }
}
