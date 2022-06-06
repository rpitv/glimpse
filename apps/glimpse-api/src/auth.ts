import {AuthChecker} from "type-graphql";
import {Ability} from "@casl/ability";
import {User} from "@generated/type-graphql"

export const auth: AuthChecker<Express.Request> = (
    { root, args, context, info },
    roles,
) => {
    console.log(roles);

    return true; // or false if access is denied
};

export async function getPermissions(user?: User): Promise<void/*Ability*/> {
    // TODO get permissions from the database. Don't cache in Redis
}
