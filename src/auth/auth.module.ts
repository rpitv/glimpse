import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalStrategy} from "./local.strategy";
import {PassportModule} from "@nestjs/passport";
import {PrismaService} from "../prisma/prisma.service";
import {AuthResolver} from "./auth.resolver";

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService, LocalStrategy, AuthResolver]
})
export class AuthModule {}
