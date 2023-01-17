import {GlimpseAbility} from "../../src/casl/casl-ability.factory";
import {User} from "../../src/user/user.entity";

declare module 'express' {
  interface Request {
    permissions?: GlimpseAbility
    user?: User
  }
}
export {};
