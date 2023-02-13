import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../types/user/user.entity";
import { Request } from "express";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private caslAbilityFactory: CaslAbilityFactory) {
        super({ passReqToCallback: true });
    }

    async validate(req: Request, username: string, password: string): Promise<User> {
        const user = await this.authService.attemptLogin(req, username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        // Regenerate the user's permissions
        req.permissions = await this.caslAbilityFactory.createForUser(user);
        return user;
    }
}
