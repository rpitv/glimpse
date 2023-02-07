import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthResolver } from "./auth.resolver";
import { AuthSerializer } from "./auth.serializer";
import { AuthController } from "./auth.controller";
import { DiscordStrategy } from "./discord.strategy";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PassportModule, PrismaModule],
    providers: [AuthService, LocalStrategy, DiscordStrategy, AuthResolver, AuthSerializer],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
