import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { argon2id, hash, verify } from "argon2";
import { User } from "@prisma/client";
import { Request } from "express";

// These are duplicated in /cli.ts. If you change them here, change them there too.
export const PASSWORD_HASH_OPTIONS = {
    type: argon2id,
    memoryCost: 32768, // 32MiB
    timeCost: 4,
    parallelism: 1
};

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async hashPassword(pass: string): Promise<string> {
        return hash(pass, PASSWORD_HASH_OPTIONS);
    }

    async verifyPassword(req: Request, username: string, pass: string): Promise<boolean> {
        return (await this.attemptLogin(req, username, pass)) !== null;
    }

    async attemptLogin(req: Request, username: string, pass: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                username: username
            }
        });

        // We intentionally don't perform any checks to make sure the password is set or the user's input is valid
        //  before attempting to verify. Doing so could reveal information about the account's password. Delegate that
        //  responsibility to argon2.
        if (user && (await verify(user.password, pass, PASSWORD_HASH_OPTIONS))) {
            delete user.password;
            await this.prisma.accessLog.create({
                data: {
                    userId: user.id,
                    service: "Glimpse API (Local)",
                    ip: req.ip
                }
            });

            return user;
        }
        return null;
    }

    async verifyDiscordCallback(req: Request, userId: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                discord: userId
            }
        });

        if (user) {
            delete user.password;
            await this.prisma.accessLog.create({
                data: {
                    userId: user.id,
                    service: "Glimpse API (Discord)",
                    ip: req.ip
                }
            });
        }

        return user;
    }
}
