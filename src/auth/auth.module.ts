import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalStrategy} from "./local.strategy";
import {PassportModule} from "@nestjs/passport";
import {PrismaService} from "../prisma/prisma.service";
import {AuthResolver} from "./auth.resolver";
import {AuthSerializer} from "./auth.serializer";

@Module({
  imports: [PassportModule.register({
    defaultStrategy: 'local'
  })],
  providers: [AuthService, PrismaService, LocalStrategy, AuthResolver, AuthSerializer]
})
export class AuthModule {}
