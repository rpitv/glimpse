import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { argon2id, verify } from "argon2";
import { User } from "@prisma/client";

export const PASSWORD_HASH_OPTIONS = {
    type: argon2id,
    memoryCost: 32768, // 32MiB
    timeCost: 4,
    parallelism: 1
};

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async verifyPassword(username: string, pass: string): Promise<boolean> {
        return (await this.attemptLogin(username, pass)) !== null;
    }

    async attemptLogin(username: string, pass: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                username: username
            }
        });

        // We intentionally don't perform any checks to make sure the password is set or the user's input is valid
        //  before attempting to verify. Doing so could reveal information about the account's password. Delegate that
        //  responsibility to argon2.
        if (
            user &&
            (await verify(user.password, pass, PASSWORD_HASH_OPTIONS))
        ) {
            delete user.password;
            return user;
        }
        return null;
    }

    async verifyDiscordCallback(userId: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                discord: userId
            }
        });
    }
}
