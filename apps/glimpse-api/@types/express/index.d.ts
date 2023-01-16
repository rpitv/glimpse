import {GlimpseAbility} from "../../src/casl/casl-ability.factory";

declare module 'express-session' {
  interface Request {
    permissions: GlimpseAbility
  }
}
export {};
