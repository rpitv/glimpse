import {AuthChecker} from "type-graphql";
import {Ability} from "@casl/ability";
import {User} from "./models/User";

export const auth: AuthChecker<Express.Request> = (
    { root, args, context, info },
    roles,
) => {
    console.log(roles);

    return true; // or false if access is denied
};

export async function getPermissions(user?: User): Promise<Ability> {
    // TODO get permissions from the database. Don't cache in Redis
}
