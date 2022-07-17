/**
 * Pick out a subset of an object's keys, by passing them to this function as an array.
 *   E.g. pick({a: 1, b: 2, c: 3}, ['a', 'b']) will return {a: 1, b: 2}. Useful as a utility
 *   when combined with permittedFieldsOf(), to filter out only properties which a user has access to.
 * @param source Source object to extract a set of keys from
 * @param keys Keys to extract
 * @returns An object equal to source, but only with the keys which are in the keys array.
 *   If a key is in the keys array but isn't in the source, it's ignored.
 */
import {GraphQLYogaError} from "@graphql-yoga/node";
import {AbilityActions, GlimpseAbility} from "custom";
import {accessibleBy} from "@casl/prisma";


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

/**
 * Assert that a passed password is a valid password. If not, an Error is thrown with a message explaining the problem.
 *   The thrown Error will be an instance of GraphQLYogaError. Current rules are:
 *    - Must be at least 8 characters long
 *    - Must contain at least 5 unique characters
 * @param password Password to validate.
 */
export function assertValidPassword(password: string) {
    if(!password) {
        throw new GraphQLYogaError("Password must be provided");
    }
    if(password.length < 8) {
        throw new GraphQLYogaError("Password must be at least 8 characters long");
    }
    const uniqueChars = new Set(password.split(''));
    if (uniqueChars.size < 5) {
        throw new GraphQLYogaError("Password must contain at least 5 unique characters");
    }
}

/**
 * Wrapper around the CASL Prisma accessibleBy method which requires the action parameter. This should be used
 *   instead of the accessibleBy method directly to avoid accidentally not passing the action parameter.
 * @param ability Permission Ability to check.
 * @param action Action to check the ability for permission for. Must be a non-empty string, or an Error will be thrown.
 */
export function getAccessibleByFilter(ability: GlimpseAbility, action: AbilityActions) {
    if(!action) {
        throw new Error("Action must be provided");
    }
    return accessibleBy(ability, action);
}
