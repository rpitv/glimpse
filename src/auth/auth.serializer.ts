import { AuthService } from "./auth.service";
import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../types/user/user.entity";

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) {
        super();
    }

    serializeUser(user: User, done: CallableFunction) {
        done(null, user.id);
    }

    async deserializeUser(userId: string, done: CallableFunction) {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    id: BigInt(userId)
                }
            });
            if (!user) {
                done(new Error(`User with id ${userId} does not exist.`));
                return;
            }
            done(null, user);
        } catch (e) {
            done(e);
        }
    }
}
