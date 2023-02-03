import {GlimpseAbility} from "../../src/casl/casl-ability.factory";
import {User} from "../../src/user/user.entity";
import {Prisma} from "@prisma/client";

declare module 'express' {
      interface Request {
          permissions?: GlimpseAbility;
          user?: User;
          passed?: boolean;
          prismaTx?: Prisma.TransactionClient;
      }
}
export {};
