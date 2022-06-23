

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
