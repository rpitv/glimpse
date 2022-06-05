import {Ability, RawRule} from "@casl/ability";
import {User} from "./models/User";


declare module 'express-session' {
    interface SessionData {
        permissionJSON?: RawRule[];
        userId?: number;
    }
}
declare module 'express-serve-static-core' {
    interface Request {
        permissions?: Ability;
        user?: User|null
    }
}
