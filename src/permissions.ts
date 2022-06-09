import {RawRuleOf, subject} from "@casl/ability";
import {AbilityActions, AbilitySubjects, GlimpseAbility, ResolverContext} from "custom";
import {Rule} from "graphql-shield/dist/rules";
import {rule, shield} from "graphql-shield";
import {User} from ".prisma/client";
import {IMiddlewareGenerator} from "graphql-middleware";

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
        fields: ['id','username'],
        conditions: {
            id: 1
        }
    },{
        action: 'read',
        subject: 'User',
        fields: ['id','mail'],
        conditions: {
            id: 2
        }
    }];
}

/**
 * Create a graphql-shield Rule object for a given action/subject, and optional field. These
 *   are fed into CASL and checked against the current user's permissions.
 * @param action CASL permission action to be checked
 * @param subjectObj CASL permission subject to be checked
 * @param field CASL permission field to be checked, or null to check against the whole object.
 * @returns Rule which can be passed to graphql-shield. The rule passes if the current user is
 *   able to read AT LEAST ONE object that matches the specified action/subject/field set.
 *   Permissions need to be checked again against the actual object before returning it to the user.
 */
export function enforce(action: AbilityActions, subjectObj: AbilitySubjects, field?: string): Rule {
    return rule()((parent: unknown, args: unknown, ctx: ResolverContext): boolean => {
        if(parent !== undefined) {
            return ctx.permissions.can(action, subject(subjectObj, <any>parent), field);
        }
        return ctx.permissions.can(action, subjectObj, field);
    });
}

/**
 * Get middleware from graphql-shield to protect resources within the GraphQL schema. This function needs to be
 *   modified whenever subjects are added to the schema. Otherwise, default behavior is to always deny.
 */
export function getAuthShield(): IMiddlewareGenerator<any, any, any> {
    return shield({
        Query: {
            users: enforce('read', 'User')
        },
        User: {
            id: enforce('read', 'User', 'id'),
            username: enforce('read', 'User', 'username'),
            mail: enforce('read', 'User', 'mail')
        }
    }, { // Shield options
        fallbackRule: rule()(() => false), // Deny anything which doesn't have permission
        fallbackError: () => (new Error("Insufficient permissions!"))
    })
}

/**
 * Pick out a subset of an object's keys, by passing them to this function as an array.
 *   E.g. pick({a: 1, b: 2, c: 3}, ['a', 'b']) will return {a: 1, b: 2}. Useful as a utility
 *   when combined with permittedFieldsOf(), to filter out only properties which a user has access to.
 * @param source Source object to extract a set of keys from
 * @param keys Keys to extract
 * @returns An object equal to source, but only with the keys which are in the keys array.
 *   If a key is in the keys array but isn't in the source, it's ignored.
 */
export function pick(source: {[key: string]: any}, keys: string[]) {
    return keys.reduce((result: {[key: string]: any}, key: string) => {
        if (source && source.hasOwnProperty(key)) {
            result[key] = source[key];
        }
        return result;
    }, {});
}
