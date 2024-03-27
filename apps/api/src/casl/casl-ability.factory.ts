import { InferSubjects, RawRuleOf } from "@casl/ability";
import { User } from "../types/user/user.entity";
import { createPrismaAbility, PrismaAbility } from "@casl/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AccessLog } from "../types/access_log/access_log.entity";
import { AlertLog } from "../types/alert_log/alert_log.entity";
import { Asset } from "../types/asset/asset.entity";
import { AuditLog } from "../types/audit_log/audit_log.entity";
import { BlogPost } from "../types/blog_post/blog_post.entity";
import { Category } from "../types/category/category.entity";
import { ContactSubmission } from "../types/contact_submissions/contact_submission.entity";
import { Credit } from "../types/credit/credit.entity";
import { GroupPermission } from "../types/group_permission/group_permission.entity";
import { Group } from "../types/group/group.entity";
import { Image } from "../types/image/image.entity";
import { Person } from "../types/person/person.entity";
import { PersonImage } from "../types/person_image/person_image.entity";
import { PersonRole } from "../types/person_role/person_role.entity";
import { ProductionImage } from "../types/production_image/production_image.entity";
import { ProductionRSVP } from "../types/production_rsvp/production_rsvp.entity";
import { ProductionTag } from "../types/production_tag/production_tag.entity";
import { ProductionVideo } from "../types/production_video/production_video.entity";
import { Production } from "../types/production/production.entity";
import { Redirect } from "../types/redirect/redirect.entity";
import { Role } from "../types/role/role.entity";
import { UserGroup } from "../types/user_group/user_group.entity";
import { UserPermission } from "../types/user_permission/user_permission.entity";
import { Video } from "../types/video/video.entity";
import { Vote } from "../types/vote/vote.entity";
import { VoteResponse } from "../types/vote_response/vote_response.entity";
import { GraphQLEnumType } from "graphql/type";
import { Stream } from "../types/stream/stream.entity";

type ValueOf<T> = T[keyof T];

/**
 * Enum of available actions that can be passed to GlimpseAbility's can() method.
 */
export enum AbilityAction {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Sort = "sort",
    Filter = "filter",
    Update = "update",
    Delete = "delete"
}

/**
 * Map of available subjects that can be passed to GlimpseAbility's can() method, mapping their string name to their
 *  class.
 */
export const AbilitySubjectsMap = {
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
    ProductionRSVP,
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
    VoteResponse
};

/**
 * GraphQL enum type for the AbilitySubjectsMap.
 */
export const GraphQLAbilitySubjectsType = new GraphQLEnumType({
    name: "AbilitySubjects",
    values: Object.keys(AbilitySubjectsMap).reduce((acc, key) => {
        acc[key] = { value: key };
        return acc;
    }, {})
});

/**
 * Type definition for the subjects that can be passed to GlimpseAbility's can() method, which is passed to CASL as a
 *  generic parameter.
 */
export type AbilitySubjects = InferSubjects<ValueOf<typeof AbilitySubjectsMap>, true> | "all";
/**
 * Type definition for Glimpse's CASL ability class.
 */
export type GlimpseAbility = PrismaAbility<[AbilityAction, AbilitySubjects]>;

/**
 * Injectable factory class for creating {@link GlimpseAbility} instances for a given user. This class also contains a
 * method {@link getPermissions} for retrieving an array of permissions for a given user, without generating a full
 * {@link GlimpseAbility}.
 *
 * This class is used to generate the {@link GlimpseAbility} assigned to {@link Request#permissions}.
 */
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
            if (typeof obj[key] === "object" && obj[key] !== null) {
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
     *  - $groups: Replaced with an array of the IDs of the groups that the user is a member of.
     *  - $now: Replaced with a Date object equal to the current time.
     * @param permission Permission to replace variables in.
     * @param user User that is currently logged in, or undefined or null if no user is logged in.
     * @param groupIds Array of IDs of the groups that the user is a member of. If the user is a guest, this should be
     *  an array with a single element: the ID of the guest group.
     * @returns An updated Permission object with the variables replaced.
     */
    private replaceConditionVariables<T extends UserPermission | GroupPermission>(
        permission: T,
        user?: User | null,
        groupIds?: bigint[]
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

                if (value === "$person") {
                    if (!user) {
                        throw new Error("Cannot replace $person variable in conditions because no user is logged in.");
                    }
                    this.logger.verbose(`Replacing $person variable in conditions with person ID ${user.personId}.`);
                    return user.personId;
                }

                if (value === "$groups") {
                    this.logger.verbose(`Replacing $groups variable in conditions with user group IDs ${groupIds}.`);
                    return groupIds;
                }

                if (value === "$now") {
                    this.logger.verbose(`Replacing $now variable in conditions with current time.`);
                    return new Date();
                }


                // Replace escaped variables with their unescaped versions
                if (value === "\\$id") {
                    return "$id";
                }
                if (value === "\\$groups") {
                    return "$groups";
                }
                if (value === "\\$now") {
                    return "$now";
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
    public async getPermissions(user?: User): Promise<(UserPermission | GroupPermission)[]> {
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

            const groups = (
                await this.prisma.userGroup.findMany({
                    where: {
                        userId: user.id
                    },
                    select: {
                        groupId: true
                    }
                })
            ).map((ug) => ug.groupId);

            const permissions = [...userPermissions, ...groupPermissions].map((permission) =>
                this.replaceConditionVariables(permission, user, groups)
            );

            delete (<any>user).password; // Hide password from logs
            this.logger.debug(
                `Retrieved permissions for user ${user.id} from database: ${JSON.stringify({ user, permissions })}`
            );

            return permissions;
        } else {
            const guestGroupId = (
                await this.prisma.group.findFirst({
                    where: { name: "Guest" },
                    select: { id: true }
                })
            )?.id;

            if (!guestGroupId) {
                throw new Error("Guest group does not exist.");
            }

            const guestPermissions = await this.prisma.$queryRaw<
                GroupPermission[]
            >`SELECT id, "group" as "groupId", action, subject, fields, conditions, inverted, reason 
                                        FROM group_permissions WHERE "group" = ${guestGroupId}`;

            this.logger.debug("Retrieved guest permissions from database", guestPermissions);

            return guestPermissions.map((permission) =>
                this.replaceConditionVariables(permission, null, [guestGroupId])
            );
        }
    }

    /**
     * Create a {@link GlimpseAbility} permissions object for a specified user.
     * @param user The user to get the permissions for, or undefined to get the permissions for a guest user.
     * @returns A {@link GlimpseAbility} object.
     * @see {@link https://casl.js.org/v6/en/guide/intro}
     * @see {@link https://github.com/rpitv/glimpse/wiki/API-Authorization}
     */
    public async createForUser(user?: User): Promise<GlimpseAbility> {
        this.logger.debug(`Fetching rules for the current user (user ID: ${user?.id || null})`);
        const rawPermissions = <RawRuleOf<GlimpseAbility>[]>await this.getPermissions(user);
        return createPrismaAbility<GlimpseAbility>(rawPermissions);
    }
}
