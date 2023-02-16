import {GlimpseAbility} from "../../src/casl/casl-ability.factory";
import {User} from "../../src/types/user/user.entity";
import {PrismaService} from "../../src/prisma/prisma.service";

declare module "express" {
    interface Request {
        permissions?: GlimpseAbility;
        user?: User;
        passed?: boolean;
        prismaTx?: Omit<PrismaService, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">;
    }
}
export {};
