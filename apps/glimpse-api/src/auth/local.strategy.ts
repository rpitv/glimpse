import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../user/user.entity";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ passReqToCallback: true });
    }

    async validate(req: Request, username: string, password: string): Promise<User> {
        const user = await this.authService.attemptLogin(req, username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
