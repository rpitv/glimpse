import {RawRuleOf} from "@casl/ability";
import {GlimpseAbility} from "custom";
import {User} from ".prisma/client";

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
 * Pick out a subset of an object's keys, by passing them to this function as an array.
 *   E.g. pick({a: 1, b: 2, c: 3}, ['a', 'b']) will return {a: 1, b: 2}. Useful as a utility
 *   when combined with permittedFieldsOf(), to filter out only properties which a user has access to.
 * @param source Source object to extract a set of keys from
 * @param keys Keys to extract
 * @returns An object equal to source, but only with the keys which are in the keys array.
 *   If a key is in the keys array but isn't in the source, it's ignored.
 */
export function pick(source: { [key: string]: any }, keys: string[]) {
    return keys.reduce((result: { [key: string]: any }, key: string) => {
        if (source && source.hasOwnProperty(key)) {
            result[key] = source[key];
        }
        return result;
    }, {});
}

type Pagination<T = { id: number }> = { skip?: number, take?: number, cursor?: T }

export function constructPagination(args: { [key: string]: any }): Pagination {
    let pagination: Pagination = {};
    if(args.pagination) {
        if (args.pagination) {
            if (args.pagination.skip) {
                pagination.skip = args.pagination.skip;
            }
            if (args.pagination.take) {
                pagination.take = args.pagination.take;
            }
            if (args.pagination.cursor) {
                pagination.cursor = {id: parseInt(args.pagination.cursor)};
            }
        }
    }

    return pagination;

}
